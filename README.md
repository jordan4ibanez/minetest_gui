# minetest_gui
 A gui for minetest. Uses tauri and typescript.


### Only works on Linux.

To use this you're going to need a minetestserver with this PR:
https://github.com/minetest/minetest/pull/14734


A video of it: https://youtu.be/X2O0gKai1CI

## Requires:


- [webkit2gtk 4.1](https://webkitgtk.org/)
- [librsvg2](https://en.wikipedia.org/wiki/Librsvg)
 
[Follow this to set the above 2 up](https://tauri.app/v1/guides/getting-started/prerequisites/#setting-up-linux)

- [git](https://git-scm.com/)
- [nodejs](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [rust](https://www.rust-lang.org/)

## Then install your local dependencies:
```
npm install
```

## Then you can test this like so:
```
npm run tauri dev
```

and it can hot watch your code, neat.