"""Database models."""
from sqlalchemy import Column, Float, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from .database import Base


class Recipe(Base):
    """Recipe model for storing recipe data."""
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    cuisine = Column(String(255), index=True, nullable=True)
    title = Column(String(500), index=True, nullable=False)
    rating = Column(Float, nullable=True, index=True)
    prep_time = Column(Integer, nullable=True)
    cook_time = Column(Integer, nullable=True)
    total_time = Column(Integer, nullable=True, index=True)
    description = Column(Text, nullable=True)
    nutrients = Column(JSONB, nullable=True)
    serves = Column(String(100), nullable=True)
    calories_kcal = Column(Integer, index=True, nullable=True)

    def __repr__(self):
        return f"<Recipe(id={self.id}, title='{self.title}', rating={self.rating})>"
