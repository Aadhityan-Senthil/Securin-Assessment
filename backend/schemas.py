"""Pydantic schemas for request/response validation."""
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class Nutrients(BaseModel):
    """Nutrient information schema."""
    calories: Optional[str] = None
    carbohydrateContent: Optional[str] = None
    cholesterolContent: Optional[str] = None
    fiberContent: Optional[str] = None
    proteinContent: Optional[str] = None
    saturatedFatContent: Optional[str] = None
    sodiumContent: Optional[str] = None
    sugarContent: Optional[str] = None
    fatContent: Optional[str] = None
    unsaturatedFatContent: Optional[str] = None


class RecipeBase(BaseModel):
    """Base recipe schema."""
    title: str
    cuisine: Optional[str] = None
    rating: Optional[float] = None
    prep_time: Optional[int] = None
    cook_time: Optional[int] = None
    total_time: Optional[int] = None
    description: Optional[str] = None
    nutrients: Optional[Dict[str, Any]] = None
    serves: Optional[str] = None


class RecipeOut(RecipeBase):
    """Recipe output schema with ID."""
    id: int

    class Config:
        orm_mode = True


class PaginatedResponse(BaseModel):
    """Paginated response schema."""
    page: int = Field(..., description="Current page number")
    limit: int = Field(..., description="Number of items per page")
    total: int = Field(..., description="Total number of items")
    total_pages: int = Field(..., description="Total number of pages")
    data: List[RecipeOut] = Field(..., description="List of recipes")


class HealthResponse(BaseModel):
    """Health check response."""
    status: str
    database: str
    total_recipes: int
