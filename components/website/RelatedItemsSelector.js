"use client"
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import { fetchMultiple } from '@/lib/client-fetch';
import {
    Box, FormControl, InputLabel, Select, MenuItem,
    Checkbox, ListItemText, Chip, OutlinedInput,
    CircularProgress, Typography, alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LinkIcon from '@mui/icons-material/Link';

// Theme colors
const themeColors = {
    primary: '#446E6D',
    primaryLight: '#76B4B1',
    primaryDark: '#1a2928',
    accent: '#37c0bd',
};

const SectionTitle = styled(Typography)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    paddingBottom: theme.spacing(0.5),
    borderBottom: `1px solid ${theme.palette.divider}`,
    fontSize: '1.1rem',
    '& svg': {
        marginRight: theme.spacing(0.5),
        color: themeColors.primary,
        width: '20px',
        height: '20px'
    }
}));

// Relation configuration mapping
const RELATION_CONFIG = {
    services: {
        key: 'services',
        label: 'Related Services',
        valueKey: 'relatedServices',
        color: 'primary'
    },
    industries: {
        key: 'industries',
        label: 'Related Industries',
        valueKey: 'relatedIndustries',
        color: 'primaryDark'
    },
    testimonials: {
        key: 'testimonials',
        label: 'Related Success Stories',
        valueKey: 'relatedSuccessStory',
        color: 'accent'
    },
    products: {
        key: 'products',
        label: 'Related Products',
        valueKey: 'relatedProducts',
        color: 'primary'
    },
    childServices: {
        key: 'childServices',
        label: 'Related Child Services',
        valueKey: 'relatedChikfdServices',
        color: 'accent'
    },
    projects: {
        key: 'projects',
        label: 'Related Projects',
        valueKey: 'relatedProjects',
        color: 'primaryDark'
    }
};

export default function RelatedItemsSelector({
    relations = ['services', 'industries', 'products', 'childServices'],
    value = {},
    onChange,
    disabled = false,
    isMultiple = true
}) {
    // Dynamic data state based on relations
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);

    // Memoize the relations array to prevent unnecessary re-renders
    const memoizedRelations = useMemo(() => relations, [JSON.stringify(relations)]);

    // Memoize the fetch function
    const fetchData = useCallback(async () => {
        if (memoizedRelations.length === 0) return;

        setLoading(true);
        try {
            // Use bulk API to fetch only required relations
            const fetchedData = await fetchMultiple(memoizedRelations, { withCredentials: true });
            setData(fetchedData);
        } catch (error) {
            console.error("Error fetching related items data:", error);
            toast.error("Failed to load reference data");
            // Initialize empty data for error case
            const errorData = {};
            memoizedRelations.forEach(relation => {
                errorData[relation] = [];
            });
            setData(errorData);
        } finally {
            setLoading(false);
        }
    }, [memoizedRelations]);

    // Fetch data on component mount
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Handle both single and multi-select changes
    const handleSelectChange = (e) => {
        const { name, value: selectedValue } = e.target;

        let updatedValue;
        if (isMultiple) {
            // Multi-select mode: selectedValue is already an array
            updatedValue = {
                ...value,
                [name]: selectedValue
            };
        } else {
            // Single-select mode: selectedValue is a single value, convert to array for consistency
            updatedValue = {
                ...value,
                [name]: selectedValue ? [selectedValue] : []
            };
        }

        // Call parent onChange with updated values
        if (onChange) {
            onChange(updatedValue);
        }
    };

    // Dynamic render function for select content
    const renderSelectContent = (items, field, label, color = themeColors.primary) => {
        if (!items || items.length === 0) {
            return (
                <MenuItem disabled>
                    <Typography color="text.secondary">
                        No {label.toLowerCase()} available
                    </Typography>
                </MenuItem>
            );
        }

        return items.map((item) => {
            // Handle different field names for different item types
            let primaryText, secondaryText;

            if (item.Testimonial) {
                // For testimonials
                primaryText = `${item.postedBy || 'Unknown'} - ${item.role || 'Unknown Role'}`;
                secondaryText = item.Testimonial?.substring(0, 50) + (item.Testimonial?.length > 50 ? '...' : '');
            } else {
                // For other items (services, products, industries, etc.)
                primaryText = item.Title || item.title || 'Untitled';
                secondaryText = (item.deltail || item.detail)?.substring(0, 50) + ((item.deltail || item.detail)?.length > 50 ? '...' : '');
            }

            return (
                <MenuItem key={item._id} value={item._id} sx={{ py: 0.5 }}>
                    {isMultiple && (
                        <Checkbox
                            size="small"
                            checked={value[field]?.indexOf(item._id) > -1 || false}
                            sx={{
                                color: themeColors.primaryLight,
                                '&.Mui-checked': {
                                    color: color,
                                },
                            }}
                        />
                    )}
                    <ListItemText
                        primary={primaryText}
                        secondary={secondaryText}
                        primaryTypographyProps={{ fontWeight: 500, fontSize: '0.85rem' }}
                        secondaryTypographyProps={{ fontSize: '0.7rem' }}
                    />
                </MenuItem>
            );
        });
    };

    // Dynamic render function for chips (multi-select) or single value display
    const renderValue = (selected, items, color = themeColors.primary) => {
        if (isMultiple) {
            // Multi-select: show chips
            if (!selected || selected.length === 0) {
                return null; // Let Material-UI handle empty state
            }

            return (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((selectedId) => {
                        const item = items?.find(i => i._id === selectedId);
                        let chipLabel = 'Loading...';

                        if (item) {
                            if (item.Testimonial) {
                                // For testimonials
                                chipLabel = `${item.postedBy || 'Unknown'}`;
                            } else {
                                // For other items
                                chipLabel = item.Title || item.title || 'Untitled';
                            }
                        }

                        return (
                            <Chip
                                key={selectedId}
                                label={chipLabel}
                                size="small"
                                sx={{
                                    fontWeight: 500,
                                    fontSize: '0.7rem',
                                    height: '20px',
                                    backgroundColor: alpha(color, 0.1),
                                    '& .MuiChip-label': {
                                        color: color,
                                        fontSize: '0.7rem',
                                        px: 1
                                    }
                                }}
                            />
                        );
                    })}
                </Box>
            );
        } else {
            // Single-select: show just the text of selected item
            if (!selected) {
                return null; // Let Material-UI handle empty state
            }

            // For single select, selected is the single ID value from the Select component
            const item = items?.find(i => i._id === selected);
            let displayText = 'Loading...';

            if (item) {
                if (item.Testimonial) {
                    // For testimonials
                    displayText = `${item.postedBy || 'Unknown'} - ${item.role || 'Unknown Role'}`;
                } else {
                    // For other items
                    displayText = item.Title || item.title || 'Untitled';
                }
            }

            return (
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                    {displayText}
                </Typography>
            );
        }
    };

    if (loading) {
        return (
            <Box sx={{ mb: 4 }}>
                <SectionTitle variant="h6" gutterBottom>
                    <LinkIcon />
                    Related Items
                </SectionTitle>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 4
                }}>
                    <CircularProgress sx={{ color: themeColors.primary, mr: 2 }} />
                    <Typography color="text.secondary">
                        Loading related items data...
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ mb: 4 }}>
            <SectionTitle variant="h3" className='border-none pb-0 mb-0' >
                Related Items
            </SectionTitle>

            {/* Dynamic grid based on relations */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: {
                    xs: '1fr',
                    md: relations.length === 1 ? '1fr' : relations.length === 2 ? '1fr 1fr' : '1fr 1fr'
                },
                gap: 2
            }}>
                {relations.map((relation) => {
                    const config = RELATION_CONFIG[relation];
                    if (!config) return null;

                    const items = data[relation] || [];
                    const colorValue = themeColors[config.color] || themeColors.primary;

                    return (
                        <FormControl key={relation} fullWidth margin="normal">
                            <InputLabel
                                id={`related-${relation}-label`}
                                sx={{ '&.Mui-focused': { color: themeColors.primary } }}
                            >
                                {config.label}
                            </InputLabel>
                            <Select
                                labelId={`related-${relation}-label`}
                                multiple={isMultiple}
                                name={config.valueKey}
                                value={
                                    isMultiple
                                        ? (value[config.valueKey] || [])
                                        : (value[config.valueKey]?.[0] || '')
                                }
                                onChange={handleSelectChange}
                                disabled={disabled}
                                input={
                                    <OutlinedInput
                                        label={config.label}
                                        sx={{
                                            borderRadius: 1.5,
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: themeColors.primary,
                                            },
                                        }}
                                    />
                                }
                                renderValue={(selected) => renderValue(selected, items, colorValue)}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 300,
                                            maxWidth: 400
                                        }
                                    }
                                }}
                            >
                                {renderSelectContent(items, config.valueKey, config.label, colorValue)}
                            </Select>
                        </FormControl>
                    );
                })}
            </Box>
        </Box>
    );
}
