"""Utility functions for data processing."""
import math
import re
from typing import Any, Dict, Optional, Tuple


def is_nan_value(value: Any) -> bool:
    """Check if value represents NaN or invalid numeric value."""
    try:
        if value is None:
            return True
        if isinstance(value, float) and math.isnan(value):
            return True
        if isinstance(value, str):
            s = value.strip().lower()
            if s in {"nan", "null", "none", "", "na", "n/a"}:
                return True
        return False
    except Exception:
        return True


def to_int_or_none(value: Any) -> Optional[int]:
    """Convert value to int or None if invalid."""
    if is_nan_value(value):
        return None
    try:
        return int(float(value))
    except Exception:
        return None


def to_float_or_none(value: Any) -> Optional[float]:
    """Convert value to float or None if invalid."""
    if is_nan_value(value):
        return None
    try:
        f = float(value)
        if math.isnan(f):
            return None
        return f
    except Exception:
        return None


def parse_calories_kcal(nutrients: Optional[Dict[str, Any]]) -> Optional[int]:
    """Extract numeric calories value from nutrients dict."""
    if not nutrients or not isinstance(nutrients, dict):
        return None
    
    raw = nutrients.get("calories")
    if not raw:
        return None
    
    if isinstance(raw, (int, float)):
        try:
            return int(float(raw))
        except Exception:
            return None
    
    if isinstance(raw, str):
        # Extract first number from strings like "389 kcal"
        m = re.search(r"(-?\d+(?:\.\d+)?)", raw)
        if m:
            try:
                return int(float(m.group(1)))
            except Exception:
                return None
    
    return None


def parse_op_value(expr: Optional[str]) -> Optional[Tuple[str, float]]:
    """
    Parse comparison expressions like '>=400', '<=500', '=200', '400'.
    Returns (operator, value) tuple or None if invalid.
    """
    if not expr:
        return None
    
    s = str(expr).strip().replace(" ", "")
    m = re.match(r"^(<=|>=|=|<|>)?(-?\d+(?:\.\d+)?)$", s)
    
    if not m:
        return None
    
    op = m.group(1) or "="
    val = float(m.group(2))
    
    return op, val
