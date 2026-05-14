import { Skeleton as MuiSkeleton, Box, SkeletonProps as MuiSkeletonProps } from '@mui/material';

export type SkeletonProps = MuiSkeletonProps;

export function Skeleton(props: SkeletonProps) {
  return <MuiSkeleton animation="wave" {...props} />;
}

export interface SkeletonTextProps {
  lines?: number;
  width?: number | string;
  lastLineWidth?: number | string;
  spacing?: number;
}

export function SkeletonText({ lines = 3, width = '100%', lastLineWidth = '60%', spacing = 0.5 }: SkeletonTextProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: spacing }}>
      {Array.from({ length: lines }).map((_, i) => (
        <MuiSkeleton key={i} animation="wave" width={i === lines - 1 ? lastLineWidth : width} />
      ))}
    </Box>
  );
}

export interface SkeletonCardProps {
  rows?: number;
  showAvatar?: boolean;
}

export function SkeletonCard({ rows = 3, showAvatar }: SkeletonCardProps) {
  return (
    <Box
      sx={{
        p: 2.5,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1.5,
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
        {showAvatar && <MuiSkeleton variant="circular" width={32} height={32} animation="wave" />}
        <Box sx={{ flex: 1 }}>
          <MuiSkeleton animation="wave" width="40%" />
          <MuiSkeleton animation="wave" width="25%" />
        </Box>
      </Box>
      <SkeletonText lines={rows} />
    </Box>
  );
}

export interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export function SkeletonTable({ rows = 5, columns = 4 }: SkeletonTableProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {Array.from({ length: rows }).map((_, r) => (
        <Box key={r} sx={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 2 }}>
          {Array.from({ length: columns }).map((__, c) => (
            <MuiSkeleton key={c} animation="wave" height={28} />
          ))}
        </Box>
      ))}
    </Box>
  );
}

export default Skeleton;
