"""API route handlers."""
import math
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session
from .database import get_db
from .models import Recipe
from .schemas import PaginatedResponse, RecipeOut, HealthResponse
from .utils import parse_op_value

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
def health_check(db: Session = Depends(get_db)):
    """Health check endpoint with database status."""
    try:
        total = db.query(func.count(Recipe.id)).scalar() or 0
        return HealthResponse(
            status="ok",
            database="connected",
            total_recipes=total
        )
    except Exception as e:
        return HealthResponse(
            status="error",
            database=f"error: {str(e)}",
            total_recipes=0
        )


@router.get("/recipes", response_model=PaginatedResponse)
def get_recipes(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db)
):
    """
    Get all recipes with pagination, sorted by rating (descending).
    
    - **page**: Page number (default: 1)
    - **limit**: Number of recipes per page (default: 10, max: 100)
    """
    # Get total count
    total = db.query(func.count(Recipe.id)).scalar() or 0
    total_pages = math.ceil(total / limit) if total > 0 else 0

    # Query with sorting: non-null ratings first, then by rating desc, then by id
    query = (
        db.query(Recipe)
        .order_by(
            (Recipe.rating.is_(None)).asc(),  # Non-null first
            Recipe.rating.desc(),
            Recipe.id.asc(),
        )
        .offset((page - 1) * limit)
        .limit(limit)
    )
    
    items = query.all()

    return PaginatedResponse(
        page=page,
        limit=limit,
        total=total,
        total_pages=total_pages,
        data=items,
    )


@router.get("/recipes/search", response_model=PaginatedResponse)
def search_recipes(
    calories: Optional[str] = Query(
        None, 
        description="Filter by calories (e.g., <=400, >=200, =300, 400)"
    ),
    title: Optional[str] = Query(
        None, 
        description="Search by title (partial match, case-insensitive)"
    ),
    cuisine: Optional[str] = Query(
        None, 
        description="Filter by cuisine (partial match, case-insensitive)"
    ),
    total_time: Optional[str] = Query(
        None, 
        description="Filter by total time (e.g., <=45, >=30)"
    ),
    rating: Optional[str] = Query(
        None, 
        description="Filter by rating (e.g., >=4.5, <3.0)"
    ),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db)
):
    """
    Search recipes with multiple filters.
    
    Supports comparison operators for numeric fields:
    - `=` or no operator: equals
    - `>`: greater than
    - `<`: less than
    - `>=`: greater than or equal
    - `<=`: less than or equal
    
    Examples:
    - `/api/recipes/search?calories=<=400&title=pie&rating=>=4.5`
    - `/api/recipes/search?cuisine=italian&total_time=<=30`
    """
    q = db.query(Recipe)

    # Title filter (partial match, case-insensitive)
    if title:
        search_term = f"%{title.strip().lower()}%"
        q = q.filter(func.lower(Recipe.title).like(search_term))

    # Cuisine filter (partial match, case-insensitive)
    if cuisine:
        search_term = f"%{cuisine.strip().lower()}%"
        q = q.filter(func.lower(Recipe.cuisine).like(search_term))

    # Total time filter (numeric comparison)
    op_val = parse_op_value(total_time)
    if op_val is not None:
        op, val = op_val
        int_val = int(val)
        
        if op == "=":
            q = q.filter(Recipe.total_time == int_val)
        elif op == ">":
            q = q.filter(Recipe.total_time.isnot(None), Recipe.total_time > int_val)
        elif op == "<":
            q = q.filter(Recipe.total_time.isnot(None), Recipe.total_time < int_val)
        elif op == ">=":
            q = q.filter(Recipe.total_time.isnot(None), Recipe.total_time >= int_val)
        elif op == "<=":
            q = q.filter(Recipe.total_time.isnot(None), Recipe.total_time <= int_val)

    # Rating filter (numeric comparison)
    op_val = parse_op_value(rating)
    if op_val is not None:
        op, val = op_val
        float_val = float(val)
        
        if op == "=":
            q = q.filter(Recipe.rating == float_val)
        elif op == ">":
            q = q.filter(Recipe.rating.isnot(None), Recipe.rating > float_val)
        elif op == "<":
            q = q.filter(Recipe.rating.isnot(None), Recipe.rating < float_val)
        elif op == ">=":
            q = q.filter(Recipe.rating.isnot(None), Recipe.rating >= float_val)
        elif op == "<=":
            q = q.filter(Recipe.rating.isnot(None), Recipe.rating <= float_val)

    # Calories filter (numeric comparison on derived field)
    op_val = parse_op_value(calories)
    if op_val is not None:
        op, val = op_val
        int_val = int(val)
        
        if op == "=":
            q = q.filter(Recipe.calories_kcal == int_val)
        elif op == ">":
            q = q.filter(Recipe.calories_kcal.isnot(None), Recipe.calories_kcal > int_val)
        elif op == "<":
            q = q.filter(Recipe.calories_kcal.isnot(None), Recipe.calories_kcal < int_val)
        elif op == ">=":
            q = q.filter(Recipe.calories_kcal.isnot(None), Recipe.calories_kcal >= int_val)
        elif op == "<=":
            q = q.filter(Recipe.calories_kcal.isnot(None), Recipe.calories_kcal <= int_val)

    # Get total count for pagination
    total = q.count()
    total_pages = math.ceil(total / limit) if total > 0 else 0

    # Apply sorting and pagination
    q = q.order_by(
        (Recipe.rating.is_(None)).asc(),
        Recipe.rating.desc(),
        Recipe.id.asc()
    )
    items = q.offset((page - 1) * limit).limit(limit).all()

    return PaginatedResponse(
        page=page,
        limit=limit,
        total=total,
        total_pages=total_pages,
        data=items,
    )
