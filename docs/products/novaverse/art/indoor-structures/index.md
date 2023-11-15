# Indoor Structure Art

## Overview

The following specifications apply to structural elements like walls, floors, ceilings etc. which are intended to be
part of the apartment and commercial space architecture.

## Technical Requirements

|                        |                            |
|:-----------------------|----------------------------|
| File Format            | `fbx`                      |
| Texture Format         | `png`, `jpg`, `tga`, `tif` |
| Skinning supported     | no                         |
| Transparency supported | avoid/limited*             |
| Reflections supported  | TBA                        |
| LOD supported          | no                         |
| Grid Size              | 2.5m                       |

*Structural elements may only have transparent areas which are self containing, meaning they do not require transparency
on adjacent unrelated elements or enforce matching adjacent elements that complement the transparent areas.

## Coordinate System

|                                                                      |                                                     |
|:---------------------------------------------------------------------|-----------------------------------------------------|
| The coordinate system is left-handed with the Y-axis facing upwards. | ![Coordinate System](img/explainer-coordinates.jpg) |

## Asset Categorization

| Category | Summary                                                             |                                                |
|----------|---------------------------------------------------------------------|------------------------------------------------|
| Floors   | Floor planes usually form the walkable surface                      | ![Floor Shape](img/explainer-shape-ground.jpg) |
| Walls    | Wall meshes fill the sides of cubes                                 | ![Wall Shape](img/explainer-shape-wall.jpg)    |
| Trims    | Trim meshes cover corners, intersections and visible cross sections | ![Trim Shape](img/explainer-shape-trims.jpg)   |

## Floor Tiles

Floor tiles are simple square meshes that fill the entire bottom side of the cube they occupy. They must only contain
upwards facing parts and must be infinitely tileable.

|                                          |                                                               |
|------------------------------------------|---------------------------------------------------------------|
| Fill the entire square                   | ![Fill Square](img/explainer-shape-ground-bounds.jpg)         |
| The origin point is at the minimum point | ![Floor Origin](img/explainer-origin-ground.jpg)              |
| Do not add any obstructions              | ![No Obstructions](img/explainer-shape-ground-no-objects.jpg) |

## Wall Tiles

Wall tiles can be any shape, but they have to fill one entire side of the cube they occupy. They must be horizontally
and vertically tileable.

### Wall Origin Point

|                                                                                                                              |                                                                       |
|------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------|
| The origin point is at the lower left point when facing the wall. Only provide walls in their default (0, 0, 0) orientation. | ![Wall Origin](img/explainer-origin-wall.jpg)                         |
| Example 90 degrees rotated                                                                                                   | ![Wall Origin Rotated 90](img/explainer-origin-wall-rotated-90.jpg)   |
| Example 180 degrees rotate                                                                                                   | ![Wall Origin Rotated 180](img/explainer-origin-wall-rotated-180.jpg) |
| Example 270 degrees rotated                                                                                                  | ![Wall Origin Rotated 270](img/explainer-origin-wall-rotated-270.jpg) |
| The origin point stays in place regardless of which part of the wall it is                                                   | ![Floor Origin](img/explainer-origin-window.jpg)                      |
| Example window half right                                                                                                    | ![Floor Origin](img/explainer-origin-window-2.jpg)                    |

### Solid Wall Tiles

|                                                                                                                              |                                                              |
|------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------|
| Example                                                                                                                      | ![Example Solid Wall](img/explainer-example-wall.jpg)        |
| Fill the entire square                                                                                                       | ![Fill Square](img/explainer-shape-wall-bounds.jpg)          |
| Do not add any cutouts at intersection points where other walls will connect                                                 | ![No Cutouts](img/explainer-shape-wall-solid-no-cutouts.jpg) |

### Connected Wall Tiles

Some details like windows or wide door frames can span multiple tiles. These connected structures are split into four
parts:

- Left and right caps limit the structure on both ends
- Left and right connectors are repeated to fill the span between the caps

For the purposes of this segmentation, connected wall tiles are split in half so that each half can be swapped out
depending on its position within the structure.

#### Connected Window Example

|                         |                                                                    |
|-------------------------|--------------------------------------------------------------------|
| Example Window          | ![Example Window](img/explainer-example-window.jpg)                |
| Example Left Cap        | ![Example Left Cap](img/explainer-example-window-left-end.jpg)     |
| Example Right Connector | ![Example Right Connector](img/explainer-example-window-right.jpg) |
| Example Left Connector  | ![Example Left Connector](img/explainer-example-window-left.jpg)   |
| Example Right Cap       | ![Example Right Cap](img/explainer-example-window-right-end.jpg)   |

#### Connected Door Frame Example

|                         |                                                                  |
|-------------------------|------------------------------------------------------------------|
| Example Door Frame      | ![Example Door Frame](img/explainer-example-door.jpg)            |
| Example Left Cap        | ![Example Left Cap](img/explainer-example-door-left-end.jpg)     |
| Example Right Connector | ![Example Right Connector](img/explainer-example-door-right.jpg) |
| Example Left Connector  | ![Example Left Connector](img/explainer-example-door-left.jpg)   |
| Example Right Cap       | ![Example Right Cap](img/explainer-example-door-right-end.jpg)   |

## Trim Tiles

Trim meshes cover up visible cross-sections and mesh intersections, and can be added as artistic detail to enhance the
look of your designs. When designing these meshes, take these properties into consideration:

- Corners and trim meshes are always split in half so that they can adapt their shape depending on the left and right
  neighbours of the wall they're attached to
- Corner and trim meshes must support the three possible connection cases for each side of the wall:
    - Straight wall
    - Inner corner
    - Outer corner

|                                                                 |                                                             |
|-----------------------------------------------------------------|-------------------------------------------------------------|
| Example Inner                                                   | ![Inner Trims](img/explainer-example-trims-inner.jpg)       |
| Example Straight                                                | ![Straight Trims](img/explainer-example-trims-straight.jpg) |
| Example Outer                                                   | ![Outer Trims](img/explainer-example-trims-outer.jpg)       |

### Trim Origin Point

|                                                                 |                                                       |
|-----------------------------------------------------------------|-------------------------------------------------------|
| The trim origin follows the wall origin the trim is attached to | ![Outer Trims](img/explainer-origin-trim.jpg)         |
| This also applies to right halves                               | ![Outer Trims](img/explainer-origin-trim-outer.jpg)   |
| Outer corners belong to the wall that specifies the corner type | ![Outer Trims](img/explainer-origin-corner-outer.jpg) |

### Corners

Corner meshes are placed at inner and outer corners, and wherever two walls with incompatible geometries meet.

|                                                                                                                                                                                                                                                                                       |                                                              |
|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------|
| Inner corners provide a cover for the area where the two facing walls intersect. Since the left and right wall in a corner may have different types, corners are split in two along the diagonal.                                                                                     | ![Inner Corner](img/explainer-example-corner-left-inner.jpg) |
| Straight corners provide a clean transition for two adjacent walls that do not have matching types. They are only required for walls which are thin or have special shapes, where the absence of a transition mesh would leave visible gaps between the two neighbouring wall meshes. |                                                              |
| Outer corners provide a clean transition for two walls that only touch along their back side. These corner meshes may reach into the square which lies between the two walls. Like inner corners, outer corners are split in two along the diagonal.                                  | ![Outer Corner](img/explainer-example-corner-left-outer.jpg) |

### Vertical Caps

Vertical caps are placed on top of all walls which have no other walls stacked on top of them. They seal off the wall mesh and provide it a clean finish.
Like corner meshes, vertical caps are split diagonally for inner and outer corners.

|                  |                                                                 |
|------------------|-----------------------------------------------------------------|
| Example Inner    | ![Inner Trims](img/explainer-example-trim-left-inner.jpg)       |
| Example Straight | ![Straight Trims](img/explainer-example-trim-left-straight.jpg) |
| Example Outer    | ![Outer Trims](img/explainer-example-trim-left-outer.jpg)       |