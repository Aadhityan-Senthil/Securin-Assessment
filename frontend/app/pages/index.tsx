import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Rating,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Chip,
  InputAdornment,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Restaurant as RestaurantIcon,
} from '@mui/icons-material';
import { recipesApi, Recipe, SearchParams } from '../lib/api';
import RecipeDrawer from '../components/RecipeDrawer';

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Filters
  const [filters, setFilters] = useState<SearchParams>({
    title: '',
    cuisine: '',
    rating: '',
    total_time: '',
    calories: '',
  });
  
  const [activeFilters, setActiveFilters] = useState<SearchParams>({});

  // Fetch recipes
  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const hasFilters = Object.values(activeFilters).some(v => v);
      const params: SearchParams = {
        page,
        limit,
        ...activeFilters,
      };
      
      const response = hasFilters
        ? await recipesApi.searchRecipes(params)
        : await recipesApi.getRecipes(page, limit);
      
      setRecipes(response.data);
      setTotal(response.total);
      setTotalPages(response.total_pages);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch recipes');
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [page, limit, activeFilters]);

  const handleRowClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setDrawerOpen(true);
  };

  const handleFilterChange = (field: keyof SearchParams, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    const cleanedFilters: SearchParams = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.trim()) {
        cleanedFilters[key as keyof SearchParams] = value.trim();
      }
    });
    setActiveFilters(cleanedFilters);
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      title: '',
      cuisine: '',
      rating: '',
      total_time: '',
      calories: '',
    });
    setActiveFilters({});
    setPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      applyFilters();
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <RestaurantIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Recipe Explorer
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Discover and explore delicious recipes from around the world
          </Typography>
        </Box>

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Search & Filter
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2, mb: 2 }}>
            <TextField
              label="Recipe Title"
              placeholder="e.g., pie, pasta..."
              value={filters.title}
              onChange={(e) => handleFilterChange('title', e.target.value)}
              onKeyPress={handleKeyPress}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              label="Cuisine"
              placeholder="e.g., Italian, Mexican..."
              value={filters.cuisine}
              onChange={(e) => handleFilterChange('cuisine', e.target.value)}
              onKeyPress={handleKeyPress}
              size="small"
            />
            
            <TextField
              label="Rating"
              placeholder="e.g., >=4.5, <3"
              value={filters.rating}
              onChange={(e) => handleFilterChange('rating', e.target.value)}
              onKeyPress={handleKeyPress}
              size="small"
              helperText="Use >=, <=, >, <, or ="
            />
          </Box>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2, mb: 2 }}>
            <TextField
              label="Total Time (min)"
              placeholder="e.g., <=30, >60"
              value={filters.total_time}
              onChange={(e) => handleFilterChange('total_time', e.target.value)}
              onKeyPress={handleKeyPress}
              size="small"
              helperText="Use >=, <=, >, <, or ="
            />
            
            <TextField
              label="Calories (kcal)"
              placeholder="e.g., <=400, >=200"
              value={filters.calories}
              onChange={(e) => handleFilterChange('calories', e.target.value)}
              onKeyPress={handleKeyPress}
              size="small"
              helperText="Use >=, <=, >, <, or ="
            />
            
            <FormControl size="small">
              <InputLabel>Results per page</InputLabel>
              <Select
                value={limit}
                label="Results per page"
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
              >
                <MenuItem value={15}>15</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={30}>30</MenuItem>
                <MenuItem value={40}>40</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Chip
              label="Apply Filters"
              onClick={applyFilters}
              color="primary"
              clickable
              icon={<SearchIcon />}
            />
            <Chip
              label="Clear All"
              onClick={clearFilters}
              variant="outlined"
              clickable
              icon={<ClearIcon />}
            />
          </Box>
        </Paper>

        {/* Results Info */}
        {!loading && (
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Showing {recipes.length > 0 ? ((page - 1) * limit + 1) : 0} - {Math.min(page * limit, total)} of {total} recipes
            </Typography>
          </Box>
        )}

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {/* No Results */}
        {!loading && recipes.length === 0 && (
          <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No recipes found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your filters or search terms
            </Typography>
          </Paper>
        )}

        {/* Recipes Table */}
        {!loading && recipes.length > 0 && (
          <>
            <TableContainer component={Paper} sx={{ borderRadius: 2, mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f1f5f9' }}>
                    <TableCell sx={{ fontWeight: 700, width: '35%' }}>Title</TableCell>
                    <TableCell sx={{ fontWeight: 700, width: '20%' }}>Cuisine</TableCell>
                    <TableCell sx={{ fontWeight: 700, width: '15%' }}>Rating</TableCell>
                    <TableCell sx={{ fontWeight: 700, width: '15%' }}>Total Time</TableCell>
                    <TableCell sx={{ fontWeight: 700, width: '15%' }}>Serves</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recipes.map((recipe) => (
                    <TableRow
                      key={recipe.id}
                      hover
                      onClick={() => handleRowClick(recipe)}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: '#f8fafc',
                        },
                      }}
                    >
                      <TableCell>
                        <Tooltip title={recipe.title} placement="top-start">
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: '400px',
                            }}
                          >
                            {recipe.title}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {recipe.cuisine || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {recipe.rating ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Rating value={recipe.rating} precision={0.1} readOnly size="small" />
                            <Typography variant="body2" color="text.secondary">
                              {recipe.rating.toFixed(1)}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            N/A
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {recipe.total_time ? `${recipe.total_time} min` : 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {recipe.serves || 'N/A'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          </>
        )}

        {/* Recipe Detail Drawer */}
        <RecipeDrawer
          recipe={selectedRecipe}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
      </Container>
    </Box>
  );
}
