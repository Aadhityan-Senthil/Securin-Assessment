import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Collapse,
  Rating,
} from '@mui/material';
import {
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Restaurant as RestaurantIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { Recipe } from '../lib/api';

interface RecipeDrawerProps {
  recipe: Recipe | null;
  open: boolean;
  onClose: () => void;
}

const RecipeDrawer: React.FC<RecipeDrawerProps> = ({ recipe, open, onClose }) => {
  const [timeExpanded, setTimeExpanded] = useState(false);

  if (!recipe) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 500 },
          p: 0,
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            p: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1, pr: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                {recipe.title}
              </Typography>
              {recipe.cuisine && (
                <Chip
                  icon={<RestaurantIcon />}
                  label={recipe.cuisine}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
              )}
            </Box>
            <IconButton onClick={onClose} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          {recipe.rating && (
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Rating value={recipe.rating} precision={0.1} readOnly size="small" />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {recipe.rating.toFixed(1)}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
          {/* Description */}
          {recipe.description && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                Description
              </Typography>
              <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.7 }}>
                {recipe.description}
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Time Information */}
          <Box sx={{ mb: 3 }}>
            <Box
              onClick={() => setTimeExpanded(!timeExpanded)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.02)' },
                p: 1,
                borderRadius: 1,
                transition: 'background-color 0.2s',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTimeIcon color="primary" fontSize="small" />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Total Time
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {recipe.total_time ? `${recipe.total_time} min` : 'N/A'}
                </Typography>
                {timeExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </Box>
            </Box>

            <Collapse in={timeExpanded}>
              <Box sx={{ pl: 4, pt: 2, pb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Prep Time:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {recipe.prep_time ? `${recipe.prep_time} min` : 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Cook Time:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {recipe.cook_time ? `${recipe.cook_time} min` : 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Collapse>
          </Box>

          {/* Servings */}
          {recipe.serves && (
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Servings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {recipe.serves}
                </Typography>
              </Box>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Nutrition Information */}
          {recipe.nutrients && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Nutrition Information
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                <Table size="small">
                  <TableBody>
                    {recipe.nutrients.calories && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Calories</TableCell>
                        <TableCell align="right">{recipe.nutrients.calories}</TableCell>
                      </TableRow>
                    )}
                    {recipe.nutrients.carbohydrateContent && (
                      <TableRow>
                        <TableCell>Carbohydrates</TableCell>
                        <TableCell align="right">{recipe.nutrients.carbohydrateContent}</TableCell>
                      </TableRow>
                    )}
                    {recipe.nutrients.proteinContent && (
                      <TableRow>
                        <TableCell>Protein</TableCell>
                        <TableCell align="right">{recipe.nutrients.proteinContent}</TableCell>
                      </TableRow>
                    )}
                    {recipe.nutrients.fatContent && (
                      <TableRow>
                        <TableCell>Fat</TableCell>
                        <TableCell align="right">{recipe.nutrients.fatContent}</TableCell>
                      </TableRow>
                    )}
                    {recipe.nutrients.saturatedFatContent && (
                      <TableRow>
                        <TableCell sx={{ pl: 4 }}>Saturated Fat</TableCell>
                        <TableCell align="right">{recipe.nutrients.saturatedFatContent}</TableCell>
                      </TableRow>
                    )}
                    {recipe.nutrients.cholesterolContent && (
                      <TableRow>
                        <TableCell>Cholesterol</TableCell>
                        <TableCell align="right">{recipe.nutrients.cholesterolContent}</TableCell>
                      </TableRow>
                    )}
                    {recipe.nutrients.sodiumContent && (
                      <TableRow>
                        <TableCell>Sodium</TableCell>
                        <TableCell align="right">{recipe.nutrients.sodiumContent}</TableCell>
                      </TableRow>
                    )}
                    {recipe.nutrients.fiberContent && (
                      <TableRow>
                        <TableCell>Fiber</TableCell>
                        <TableCell align="right">{recipe.nutrients.fiberContent}</TableCell>
                      </TableRow>
                    )}
                    {recipe.nutrients.sugarContent && (
                      <TableRow>
                        <TableCell>Sugar</TableCell>
                        <TableCell align="right">{recipe.nutrients.sugarContent}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default RecipeDrawer;
