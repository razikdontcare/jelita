# Windows 7 Legacy Build Guide

This project supports building for Windows 7 using Electron v22.3.27 (the last version that supported Windows 7).

## Prerequisites

1. Install the legacy Electron version:
   ```powershell
   pnpm install
   ```

## Building for Windows 7

### Option 1: Legacy Build Only
```powershell
pnpm run build:legacy
```

This will create a Windows 7-compatible build in the `release/{version}-legacy/` directory.

### Option 2: Build Both Modern and Legacy Versions
```powershell
pnpm run build:both
```

This will create both modern (latest Electron) and legacy (Windows 7 compatible) builds.

## Development with Legacy Electron

To test your app with the legacy Electron version during development:
```powershell
pnpm run dev:legacy
```

## Output Locations

- **Modern builds**: `release/{version}/`
- **Legacy builds**: `release/{version}-legacy/`

## Legacy Build Features

- Compatible with Windows 7 SP1 and later
- Includes both x64 and ia32 (32-bit) architectures for better compatibility
- Uses Electron v22.3.27
- Outputs with `-Windows7-` in the filename for easy identification

## Important Notes

- The legacy build uses an older Electron version, so some newer features may not be available
- Always test on actual Windows 7 systems when possible
- Consider the security implications of using older Electron versions for production releases