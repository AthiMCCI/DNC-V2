import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, CardHeader, Divider, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const headerSX = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '& .MuiCardHeader-action': { margin: 0 }
};

const generateBreadcrumb = (path) => {
    const parts = path.split('/').filter(Boolean); // Remove empty parts
    const breadcrumb = parts.map((part, index) => (
        <span key={part}>
            {index > 0 && <ChevronRightIcon style={{ margin: '0 4px' }} />}
            {index === 0 ? <HomeIcon /> : part}
        </span>
    ));
    return breadcrumb;
};

const MainCard = forwardRef(
    (
        {
            border = true,
            boxShadow,
            children,
            content = true,
            contentClass = '',
            contentSX = {},
            darkTitle,
            secondary,
            shadow,
            sx = {},
            title,
            showHomeIcon,
            showBackIcon,
            onBackClick,
            currentPage,
            breadcrumbs, // Added breadcrumbs prop
            ...others
        },
        ref
    ) => {
        const theme = useTheme();
        const navigate = useNavigate();

        return (
            <Card
                ref={ref}
                {...others}
                sx={{
                    border: border ? '1px solid' : 'none',
                    borderColor: theme.palette.primary[200] + 25,
                    ':hover': {
                        boxShadow: boxShadow ? shadow || '0 2px 14px 0 rgb(32 40 45 / 8%)' : 'inherit'
                    },
                    ...sx
                }}
            >
                {title && (
                    <CardHeader
                        sx={headerSX}
                        title={darkTitle ? <Typography variant="h3">{title}</Typography> : title}
                        action={
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {showHomeIcon && (
                                    <Link to="/" style={{ marginRight: '8px' }}>
                                        <HomeIcon />
                                    </Link>
                                )}
                                {breadcrumbs && ( // Check if breadcrumbs are provided
                                    <Typography variant="body2" color="textSecondary" style={{ marginLeft: '8px' }}>
                                        {breadcrumbs}
                                    </Typography>
                                )}
                            </div>
                        }
                    />
                )}

                {title && <Divider />}

                {content && (
                    <CardContent sx={contentSX} className={contentClass}>
                        {children}
                    </CardContent>
                )}

                {!content && children}
            </Card>
        );
    }
);

MainCard.propTypes = {
    border: PropTypes.bool,
    boxShadow: PropTypes.bool,
    children: PropTypes.node,
    content: PropTypes.bool,
    contentClass: PropTypes.string,
    contentSX: PropTypes.object,
    darkTitle: PropTypes.bool,
    secondary: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
    shadow: PropTypes.string,
    sx: PropTypes.object,
    title: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
    showHomeIcon: PropTypes.bool,
    showBackIcon: PropTypes.bool,
    onBackClick: PropTypes.func,
    currentPage: PropTypes.string,
    breadcrumbs: PropTypes.node // Added breadcrumbs prop
};

export default MainCard;
