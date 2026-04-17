# Blender to Web Export Guide

This guide will help you export your Blender workspace model for use in the web portfolio.

## Prerequisites

- Blender 3.0 or newer
- Your workspace model file open in Blender

## Step-by-Step Export Process

### 1. Organize Your Scene (Optional but Recommended)

Before exporting, organize your objects using Collections:

1. In the Outliner (top-right panel), create collections:
   - `Furniture` - desk, chair, etc.
   - `Walls` - room structure
   - `Details` - small items, decorations
   - `Interactive` - objects users will click (computer, bookshelf, camera, basketball hoop, light)

2. Name your objects clearly:
   - `desk_surface`, `desk_legs`
   - `bookshelf_frame`, `bookshelf_shelf_01`
   - `computer_monitor`, `computer_keyboard`
   - `pendant_light`
   - `camera_body`
   - `basketball_hoop`

### 2. Check Materials

1. Make sure all objects have materials assigned
2. Use **Principled BSDF** shader for all materials
3. Keep textures reasonable size (2K maximum for most surfaces)
4. If using image textures, make sure they're packed or in the same folder

### 3. Lighting Setup

**Important:** Don't bake all lighting! We need the pendant light to be dynamic.

- Set up basic scene lighting as reference
- The pendant light will be controlled by code (on/off toggle)
- Ambient and directional lights will be added in Three.js

### 4. Export Settings

1. **Go to:** File → Export → glTF 2.0 (.glb/.gltf)

2. **In the export panel, configure these settings:**

**Include:**
- ☑ Selected Objects (or deselect if exporting everything)
- ☑ Custom Properties
- ☑ Cameras (optional)

**Transform:**
- ☑ +Y Up (important for correct orientation)

**Geometry:**
- ☑ Apply Modifiers
- ☑ UVs
- ☑ Normals
- ☑ Vertex Colors
- ☑ Materials: Export
- Compression: Use **Draco** if file size > 5MB

**Animation:**
- ☐ Uncheck all animation options (we don't need them)

3. **Choose format:**
   - Use **.glb** (binary) for better performance
   - File will be smaller and load faster

4. **Name your file:** `workspace.glb`

5. **Click "Export glTF 2.0"**

### 5. Place the File

After exporting:

1. Copy `workspace.glb` to: `portfolio/public/models/workspace.glb`
2. The code will automatically load it

### 6. Test Export

Once you've placed the file:

1. The dev server should hot-reload automatically
2. Check the browser console for any errors
3. Your model should appear in place of the placeholder geometry

## Optimization Tips

### Target File Size
- Aim for < 10MB total
- Use Draco compression if needed
- Combine similar meshes where possible

### For Books on Bookshelf
- Use **instancing** - create one book mesh, duplicate with Alt+D (linked duplicates)
- This drastically reduces file size

### Common Issues

**Model appears too dark:**
- Check that materials have proper roughness/metallic values
- We'll adjust lighting in code if needed

**Model orientation is wrong:**
- Make sure "+Y Up" was selected during export
- In Blender, apply all transforms: Ctrl+A → All Transforms

**Textures don't appear:**
- Make sure textures are packed: File → External Data → Pack All Resources
- Or export with textures in same folder

**File size too large:**
- Enable Draco compression
- Reduce texture sizes (use 1K instead of 2K where possible)
- Combine meshes with same material

## Interactive Object Names

Make sure these objects are clearly named so we can target them for interactions:

- `computer` or `desk_computer` - Links to case studies
- `bookshelf` - Links to Goodreads
- `camera` - Opens photo gallery
- `basketball_hoop` - Opens basketball game
- `pendant_light` or just `light` - Light toggle

## Next Steps

1. Export your first test version
2. Place it in `public/models/workspace.glb`
3. Check the result in browser (http://localhost:5173)
4. We'll iterate together on:
   - Materials and textures
   - Lighting adjustments
   - Interactive object positioning
   - Performance optimization

## Need Help?

If you run into issues:
- Share a screenshot of the export settings
- Share the Blender console output (Window → Toggle System Console)
- We can troubleshoot together

---

**Remember:** This is iterative. First export doesn't need to be perfect. We'll refine it together!
