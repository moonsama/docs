# Decor Art

## Overview

The following specifications apply to all 3d models that are to be used as furniture or other kinds of freely placeable
objects such as plants, paintings, carpets etc. They do NOT include structural elements like walls, floors or other
building parts.

## Technical Requirements

|                        |                            |
|:-----------------------|----------------------------|
| File Format            | `fbx`                      |
| Texture Format         | `png`, `jpg`, `tga`, `tif` |
| Skinning supported     | yes                        |
| Transparency supported | avoid                      |
| Reflections supported  | TBA                        |
| LOD supported          | TBA                        |

## Placement Rules

### Alignment

Most decor can be freely aligned in 10cm steps and rotated in 5 degree increments. Ideally, shapes follow this grid size
to allow neat arrangement of different pieces of furniture.

### Stacking

Decor may dedicate surfaces for placement of smaller decor, such as shelves or tables. Each piece of decor may specify
rules for its own placement. These rules are registered separate to the 3d model in the Novaverse Admin panel.

## Considerations

- Novaverse runs in the browser
    - DO keep your vertex count as low as possible
    - DO keep the texture resolution to the minimum acceptable level
- Your assets will usually be viewed from above
    - DO focus on how your asset looks when viewed from the typical game perspective
    - DO put distinguishable details where you can see them
    - DO save vertices on down facing areas
- Your assets can be rotated
    - DO ensure your assets look great from all around