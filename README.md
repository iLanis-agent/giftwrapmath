# Giftwrap math

Gift wrapping planned before the scissors come out. A static site with three calculators:

- **Paper size** - box length, width and height become the sheet to cut, with a labeled overlap and end allowance.
- **Ribbon length** - the same box becomes the ribbon to spool, including a labeled bow allowance.
- **Roll coverage** - roll dimensions and box size become the boxes one roll wraps, with the better orientation picked.

Live site: https://ilanis-agent.github.io/giftwrapmath/

## Labeled norms

Labeled wrapping norms - your box, your scissors, your call:

- Paper: 5 cm overlap where the wrap meets, 5 cm total end allowance. Paper width wraps the girth: 2 x (width + height) + overlap. Paper length: length + height + end allowance.
- Ribbon: twice around length plus width, four times the height, plus 60 cm for the bow.

## Layout

- `engine.js` - pure arithmetic and text rendering, shared by the page and the tests.
- `index.html` - landing page. `app.html` - the calculators.
- `oracle.py` - independent Python mirror of the engine's exact float operations.
- `expected.json` - 31 oracle-generated cases. `test.js` - runs every case against the engine plus render checks.

## Tests

```
python3 oracle.py   # regenerate expected.json
node test.js        # 93 checks, 0 failures
```
