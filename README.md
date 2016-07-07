# juggle-sugggest

Juggle suggest is a program which takes the prefixes of valid siteswaps and produces a
valid siteswap along with some visulaizations. 

Although it is already quite good, I have a number of additional things I would like to
do for it which I've details below in rough priority order.

## v2 - features
- Colored balls - consider http://stackoverflow.com/questions/6921792/how-to-draw-circle-in-html-page
- Multiplex/vanilla toggle for completions
- Some kind of user guide
- Possibly offer more completions
  - fewest balls added?
  - most/fewest orbits?
  - user configurable length?
- Show number of balls being juggled
- Better error messages explaining why a pattern is invalid


## v2 - bugs
- Lack of completions after '[',
- Investigate completion disappearing after you hit shift or control
- Better behavior when resizing
- Handle cases when all suggestions contains a value higher than z
  i.e 666666666666666666666666666666666666[67]

## v2 - other
- do some performance profiling
- improve ui when your pattern is valid?


## v3 (maybe someday)
- Sync
- Better animation of stacked muliplexes like [33] see http://i.imgur.com/TPZdF74.gif
- replace vanilla/mutiplex toggle with a silder of max number of balls allowed
  to be thrown at once
