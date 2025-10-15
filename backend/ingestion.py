"""Data ingestion utilities for loading recipes from JSON."""
import json
import os
from typing import Dict, Any
from sqlalchemy.orm import Session
from .models import Recipe
from .utils import to_int_or_none, to_float_or_none, parse_calories_kcal


def load_json_to_db(json_path: str, session: Session) -> int:
    """
    Load recipes from a JSON file into the database.
    
    Args:
        json_path: Path to the JSON file
        session: Database session
        
    Returns:
        Number of recipes inserted
        
    Raises:
        RuntimeError: If JSON is invalid or malformed
    """
    if not os.path.exists(json_path):
        print(f"Warning: JSON file not found at {json_path}")
        return 0

    with open(json_path, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError as e:
            raise RuntimeError(f"Invalid JSON in {json_path}: {e}")

    # Handle different JSON structures
    if isinstance(data, dict):
        for key in ("recipes", "data", "items"):
            if key in data and isinstance(data[key], list):
                data = data[key]
                break
    
    if not isinstance(data, list):
        raise RuntimeError(
            "JSON must be an array of recipe objects or contain a list "
            "under 'recipes', 'data', or 'items' key."
        )

    inserted = 0
    skipped = 0
    
    for rec in data:
        if not isinstance(rec, dict):
            skipped += 1
            continue

        # Extract and validate required fields
        title = rec.get("title") or rec.get("name")
        if not title:
            skipped += 1
            continue

        # Extract optional fields with NaN handling
        cuisine = rec.get("cuisine")
        rating = to_float_or_none(rec.get("rating"))
        prep_time = to_int_or_none(rec.get("prep_time"))
        cook_time = to_int_or_none(rec.get("cook_time"))
        total_time = to_int_or_none(rec.get("total_time"))
        description = rec.get("description")
        serves = rec.get("serves")
        
        # Handle nutrients
        nutrients = rec.get("nutrients")
        if not isinstance(nutrients, dict):
            nutrients = None
        
        # Parse calories for efficient filtering
        calories_kcal = parse_calories_kcal(nutrients)

        # Create recipe instance
        recipe = Recipe(
            cuisine=cuisine,
            title=str(title),
            rating=rating,
            prep_time=prep_time,
            cook_time=cook_time,
            total_time=total_time,
            description=description,
            nutrients=nutrients,
            serves=serves,
            calories_kcal=calories_kcal,
        )
        
        session.add(recipe)
        inserted += 1

    session.commit()
    
    if skipped > 0:
        print(f"Skipped {skipped} invalid records")
    
    return inserted


def reset_database(session: Session) -> int:
    """
    Delete all recipes from the database.
    
    Args:
        session: Database session
        
    Returns:
        Number of recipes deleted
    """
    count = session.query(Recipe).count()
    session.query(Recipe).delete()
    session.commit()
    return count
