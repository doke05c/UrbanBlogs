---
title: 'NYCDensityMapper, Pt. 2 - Discussing the Patterns'
description: "Using the NYC Density Maps I developed and walked through my creation of in my previous post, I give some thoughts on the patterns--and the changes that should be happening--in New York's density."
---

#### [Why don't you go back?](/..)


##### NYCDensityMapper, Pt. 2 - Discussing the Patterns

##### Using the NYC Density Maps I developed and walked through my creation of in my previous post, I give some thoughts on the patterns--and the changes that should be happening--in New York's density.

![Manhattan](/assets/images/2_manhattan.png)
![Bronx](/assets/images/2_bronx.png)
![Brooklyn](/assets/images/2_brooklyn.png)
![Queens](/assets/images/2_queens.png)
![Staten Island](/assets/images/2_staten.png)
#### NYC's residential density mapped by the block level.

### About those Blocks...

##### Midtown's Black Hole
We've all seen it on the street: it's 5 PM. Office workers, hedge fund managers, CEOs, and interns alike walking down 6th Avenue, finding the nearest ten-dollar coffee store or subway entrance. You think, wow, this place really is the financial capital of the world...... if you're a tourist, that is!

Jokes aside, despite being known for its lively business activity in the day, the office district of Manhattan, which comprises this part of Midtown:

![Deadtown GMaps](/assets/images/3_midtowngmaps.png)

is quite dead after the standard work day is over. Come past midnight, and it is almost a dead zone. As Andres Duany and Elizabeth Plater-Zyberk pointed out in _Suburban Nation_, having a city be active 24 hours a day, aka be a "24-hour city", is essential to economic and social health, and round-the-clock safety, aka self-policing, which is honestly something we could all use more of in the US. Unfortunately, the housing density of this commercial district looks like this:

![Deadtown Render](/assets/images/3_midtownrender.png)
#### A near black hole of housing density in what should be New York's densest region.


As housing is essential to maintaining a 24-hour city (no city can ever function round-the-clock if people aren't living there, with some very very specific exceptions like gambling districts or airports), Manhattan's office district is very heavily at risk of being a ghost town at night. Bars, restaurants, and clubs can only be open for so long, usually themselves only until 1 or 2 AM. 

In order to bring this very core area of New York back to life, it is imperative that new housing be offered here, of course, at a wide range of price points to support a diverse economic mix. Especially following the COVID-19 pandemic, many office spaces are sitting around unused, unsold, or worse yet, completely undeveloped. As husks of buildings sit empty and undeveloped in the middle of Manhattan's most prized section of real estate, while people are sleeping rough on the street right outside, one wonders if this is some kind of practical joke. 

Thankfully, there _has_ been incremental movement towards housing in Midtown's office district in recent years, especially seen in the Grand Central Area. The Office of the Mayor of New York City has posted a [statement](https://www.nyc.gov/office-of-the-mayor/news/022-23/mayor-adams-recommendations-convert-underused-offices-homes) on rezoning and redeveloping Midtown's, and other boroughs' office districts for housing, which is ultimately good. 

From the Statement:

"_The Office Adaptive Reuse Task Force was convened by the Adams administration in July 2022 following Local Law 43, sponsored by New York City Councilmember Justin Brannan. The task force’s recommendations include: Expanding the universe of office buildings with the most flexible regulations for conversion to residential use from buildings constructed through 1961 to those constructed through 1990 — easing the potential conversion process for an additional 120 million square feet of office space... Finding opportunities to allow housing, whether through conversions or new construction, in a centrally located, high-density part of Midtown that currently prohibits residential development..._" 

Hopefully this will bring about a quick change to many of the failing 24-hour neighborhoods of New York City, giving them the housing opportunities, and the night life that they deserve.

##### SoHo - a Tale of Two Districts

Beautiful SoHo, the land of transplants, rich tourists, NYU students who don't know any better, and buildings that cost millions to own. After all, it is the vaunted Cast-Iron Historic District! What else could you expect? Except what if I told you that there was a cheaper way to own or rent some of these buildings' spaces with almost the exact same interior quality, with identical buildings, identical street culture, in the same exact neighborhood? You would call me insane, until I told you about an interesting part of SoHo you may have never heard of. Here's why this is the case.

Let's start with a strange pattern I noticed in the density map in Lower Manhattan. 

![SoHo Density Split, DensityMap](/assets/images/3_sohorender.png)

In Soho, the West Broadway street serves as a sort of barrier between two zones of density, with blocks east of it having housing densities between 40-80 units per acre, and blocks west of it having housing densities between 100-200 units per acre. What we're essentially seeing is a 150% increase in density just by jumping one block. You might be wondering: "These two blocks must have different types and sizes of buildings, right?"

Take a look at this shot of West Broadway, and tell me which side is which.

![WBway Split Shot](/assets/images/3_wbwaynodiff.jpg)

If you couldn't figure it out, don't worry. Neither could I, until I pulled out Google Maps to see which way was north. (FYI, the left side is the denser one)

Generally, both sides of this street feature buildings with mixed use, four-to-six story buildings, classic architecture styles, including the historic cast-iron style, and a calm, yet lively atmosphere. No, in order to see what makes these two sides of SoHo so different in density, one will not be able to discern anything from the _**outside**_ of the buildings. We will instead need to look **_inside_** of them.

Let's consider some possible differences on the inside of these otherwise identical buildings that may lead to differing densities, especially differences with a factor of 2.5. Starting off, the difference in first-floor business presence, while possible, is one: not played out in reality, as both sides have healthy amounts of first-floor commerce, and two: negligible were it real, since whether all four-to-six of the floors of a building are used for residential purposes or just three-to-five cannot make a difference any larger than 50%, and that's being generous. 

The only difference that can make such a big impact as the one seen along West Broadway is the quantity of units per floor. While not often talked about, units per floor can be a helpful measure of density on a building-to-building scale, as it can help us figure out how efficiently builders and landlords choose to parcel out the space inside of a given building.

To confirm this suspicion I had on units per floor, I slightly modified the code of my density mapper to track the average units per floor of all buildings in a block instead of just the average residential units per block. Instead of the raw unit per floor value per building, I calculated the average over an entire block with the number of floors factored in, in order to account for the number of units per floor of large buildings, or large **complexes** of buildings that took up one lot, appearing as one "building" object. Instead of biasing the unit per floor count in favor of larger buildings, this takes into account the number of floors and buildings in every lot in a block, giving fairer, and more importantly for us, **comparable** results in seeing what makes the SoHo border tick.

Here's what that modification looks like in SoHo:

![SoHo Density Split, DensityMap w/ Units per Floor](/assets/images/3_sohorenderunitspfloor.png)

As you can see, the split in density once again follows West Broadway, and it highlights the core differences between these two parts of SoHo: the number of units per floor of a given building. Blocks east of the border have buildings with around 1 unit per floor on average, while blocks west of the border have buldings with around 2-3 units per floor on average. What this means is a 2.5x difference per floor density. If you remember that number appearing somewhere else, good job! Your short-term memory is better than mine! 

We can safely account for almost all of the density difference between these two parts of SoHo using this difference in floor plan. How exactly did the floor plans become so universally segregated? And what exactly does this mean for you, potential SoHo renter? (I mean seriously, have you please considered living somewhere else? You cannot **really** be this desperate to live in SoHo that you're reading some nerd's density blog about it, right?)

We must look at the zoning and politics behind the two historic districts that make up SoHo in order to understand this. That's right, there's two of them. The vaunted Cast-Iron district has a quiet twin brother: the Sullivan-Thompson Historic District. The border of these two districts is, of course, West Broadway. These two districts matured in very different ways from their inception. 

When these two areas were built in the early 19th century, they followed very different trajectories. Sullivan-Thompson became known for its high population of Italian and African-American immigrants and densified the existing rowhouses to support multiple families per floor as needed. 

![Web Image of Sull-Tho on map](/assets/images/3_stmap.png)

#### A 1920 map of Manhattan shows the major hub of the Italian neighborhood of the South Village (now Sullivan-Thompson) and Little Italy. It ends to its east at West Broadway. [(Source)](https://www.villagepreservation.org/2016/12/23/sullivan-thompson-a-district-of-immigrants/)

Meanwhile, the Cast-Iron area became known for its high quantity of industry, and later, intense crime. The older, wealthy residents of the area, who moved in before many of the cast-iron buildings were made, fled. The population slowly dwindled into the 20th century, and it became barren of life and basic services. In truth, only recently did this area become known for any sort of population presence. As young people and artists illegally moved into this area during mid-century for its large open spaces (remember that one unit per floor thing?), it slowly became a region of wealth and power once more. They even won their rights to legally live there by modifying the zoning code, and successfully fended off an attempt to build an expressway through their neighborhood. This triumph of redevelopment of an industrial area spawned what we know now as "gentrification", although there weren't many people living there prior to the wealthier artists at the time to "push out", so to speak.

![Web Image of Cast-Iron on map](/assets/images/3_sohohistoric.jpg)

#### A 1973 map of the Cast-Iron Historic District, as it was being drawn up. It ends to its west at West Broadway. [(Source)](https://sohobroadway.org/soho-castironhistoricdistrict-landmarks/)

This triumph, as it goes without saying, is very limited, as many who have seen triumphs of the wealthy can attest. Most notably, the living space of these buildings has not changed from the "large and lofty" type that the original artists moved into, while the neighboring immigrant area of Sullivan-Thompson had split their spaces to fit more families. In 1973, the artists' district had been "Cast in Iron", so to speak, as their newly-passed historic district essentially prohibited any modifications to  these buildings, even if they involved slightly modifying the inside of the buildings to support multiple families, without  touching the, I will admit, beautiful exterior. Forever locking the relative sparsity in place, the Cast-Iron remains one of the most exclusive and unaffordable places in Manhattan, and it is almost directly tied to how spacious a single unit is. Comparing dense Sullivan-Thompson to sparse Cast-Iron in online rental listings (I used Zillow here) shows us how this affects the needs of regular New Yorkers who are looking for housing. 

![SoHo Zillow](/assets/images/3_sohozillow.jpg)

With the exception here or there, units in the Cast-Iron district range from 10 to 30 grand a month to rent. (If I wasn't in Macaulay, the tuition at NYU would have been cheaper than this.) Meanwhile units in the Sullivan-Thompson district range from two and a half to seven thousand a month to rent. While still expensive to be sure, this represents a four-fold decrease in rent prices, along with a MUCH greater availability of units than in the cast-iron district, despite it being a much smaller district in area.

While the cast-iron aesthetic definitely plays a role in the price difference here, it is obvious that the density and size of these units is also doing some heavy lifting in determining price, as supply of units heavily affects price just as demand for fancy iron buildings does. Another obvious fact is that this does two things for income inequality in New York:

1) It segregates who can live where. If there is no slow gradient or mix of unit types between cramped apartments and lofty floors, there will inevitably be a segregation of incomes. This is more obvious, and more serious, across Manhattan and NYC than it is in just SoHo, but SoHo is a great example as to how this can take place even in what people often perceive as an exorbitantly expensive or wealthy area. A single block can successfully separate the middle class from the ultra-wealthy.

2) It limits access to better served areas from those with less means. While Harlem is ripped apart from the Upper West or East Sides in an explicitly racial and evil manner, with many residents from the former never dreaming of affording the latter, it is a shame to imagine that all one needs to be able to afford a nicer apartment in a better served area, like the Cast-Iron district is now what with their boutique clothing shops and fancy restaurants, is just **better zoning.** 

Densifying the Cast-Iron district can drive prices down by increasing supply, making it easier for less wealthy people to also be able to live in such a posh area of Manhattan. This is what I call "reverse gentrification", poor or working class folks moving into and improving the economic diversity of an otherwise inaccessibly wealthy area. This has been shown numerous times in sociological studies to be the best way to handle those who live in concentrated poverty: **_deconcentrate_** the poverty. Richard Rothstein's _Color of Law_ best demonstrates the positive effects of this type of program in the example of Maryland's 1995 HUD Lawsuit, which resulted in the following:

"_Successful civil rights lawsuits have led to a few innovative programs that integrate low-income families into middle-class neighborhoods. In 1995 the American Civil Liberties Union of Maryland sued HUD and the Baltimore Housing Authority because as these agencies demolished public housing projects, they resettled tenants (frequently with Section 8 vouchers) almost exclusively in segregated low-income areas. The lawsuit resulted in commitments by the the federal and local governments to support the former residents in moving to high-opportunity suburbs. The authority now funds an increased subsidy, higher than the regular Section 8 voucher amount, to families that rent in nonsegregated communities throughout Baltimore County and other nearby counties. Participants can use their vouchers in neighborhoods where the poverty rate is less than 10 percent, the population is no more than 30 percent African American or other minority, and fewer than 5 percent of households are subsidized. The mobility program not only places voucher holders in apartments; it also purchases houses on the open market and then rents them to program participants. It provides intensive counseling to the former public housing residents to help them adjust to their new, predominantly white and middle-class environs. Counseling covers topics such as ﻿household budgeting, cleaning and maintenance of appliances, communicating with landlords, and making friends with neighbors._

_Those who have participated in this Baltimore program left communities with average poverty rates of 33 percent and found new dwellings where average rates were 8 percent. In their former neighborhoods, the African American population was 80 percent; in their new ones it is 21 percent._" (Rothstein, 209-211)

Instead of rich folks driving out poor folks by shooting rents into the sky, like what is ironically happening in Harlem, let's pay realtors and building owners to split up these SoHo buildings into multi-unit floors, subsidize renters who will rent apartments in the new units, and watch those prices fall. 

That being said, this change will not actually introduce **THAT** much economic diversity. No working class person can afford even Sullivan-Thompson present-day rents; SoHo will always be SoHo, but this can be used as a good example for densification projects in other, more suburban areas of NYC and elsewhere. Also for the most part, if people who already live in the larger SoHo units want to keep them, they are more than welcome to. They will also not experience significant real estate drops in their existing property, only price drops in for sale or for rent spaces where they have been densified. However, let's say real estate values **DO** drop (which they won't):

Concerns of the rich and their property values are mostly moot and inexcusable when many of them are perfectly comfortable doing the exact **OPPOSITE** to their poorer neighbors: renting cheap apartments, jacking up real estate values, and the most insidious of them all, watching poor people lose their homes because they cannot afford to live there anymore. 

## **Let's stop pretending that rich people losing their real estate values is equally as bad as poor people losing their homes.** 

In sum, while its solution is **_NOWHERE_** near enough to fix the housing and housing affordability crises, the situation belying the two districts of SoHo shows how arbitrary housing price differences are. While this can be bleak, it is also a positive message in some way: we can just as arbitrarily lower these prices by reintroducing density into the equation. Densification almost always allows for greater affordability. Towards that end, there is a more exceptional tale I must tell...

##### East Side Story
-similarly to soho, UES is split into two regions, also west and east
-western side (5th av to generally around lexington) is labeled historic district from 59 to 79 (above 79 does not concern us) (https://www.nyc.gov/assets/lpc/downloads/pdf/maps/HistoricDistrictMaps/Manhattan/Upper_East_Side.pdf) starting in ~1979-1981 (http://s-media.nyc.gov/agencies/lpc/lp/1051.pdf)
-eastern side has no historic protections whatsoever, but this actually isnt as bad as it sounds
-ensuing legal and political battle begins between developers/planners and historic preservation advocates such as civitas (closet NIMBYs, lets be real) in the late 80s over the "avenues" of UES (3rd-1st) (https://www.nytimes.com/1987/12/06/realestate/downscaling-the-avenues-on-the-upper-east-side.html)
-civitas loses the war of attrition (citation needed) and now the eastern upper east side is WILDLY different in character than the western upper east side (show renders + pics)
-WUES is less dense, quieter, more uniform in height (~12-17 fl), almost no business on the streets
-EUES is denser, more active, more engaging to look at due to the height differences (heights can range from 4 to 50 fl), more shops and restaurants
-result? EUES is more affordable (citation needed) and just a better place to explore and have fun in
-once again, hist. designations can help, but we must be careful of preservation becoming stagnation
-we want neighborhoods, not walk-thru museums!

##### 1520 Sedgewick Avenue: When Density Fails
##### The Legacy of Moses (Bronx/Qns/SI Highway Mayhem)
##### Land vs. Votes: Sprawl's Misrepresentation of NYC's Population Distribution

##### The Boroughs and TOD (Brighton/QBL/Flushing vs. EP/White Plains/Fulton/Jerome/GC)
##### DeKalb & Jackson: Redefining Downtown or Gentrification Anew?

##### What is Dense Enough (for me)?