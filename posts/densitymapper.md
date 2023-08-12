---
title: 'NYCDensityMapper - Showing the Patterns'
description: "Using Python, SQL, and ZoLa, I made a map of NYC's housing density by the block, with some interesting results. See my process in creating it, and my personal thoughts!"
---

#### [Why don't you go back?](/..)


##### NYCDensityMapper - Showing the Patterns

##### Using Python, SQL, and ZoLa, I made a map of NYC's housing density by the block, with some interesting results. See my creation process, and some thoughts on the changes happening--and the changes that should be happening--in New York's density.

It all began when I was reading Vishaan Chakrabarti's _A Country of Cities_ and saw a passage from his talk of hyperdensity that piqued my interest. It went something along the lines of "strong cities with reliable metro transit cannot work unless they achieve a density of 30 residential units per acre", and of course, on the other side of the page was a cute graphic of what 30 units per acre could look like on a city block. 

My immediate first thought was, "that seems a little unfair, doesn't it? 30 might not be a possible density for many urban blocks." Not knowing anything about how dense an average city block was, or what the hell an acre was (I still don't really know what an acre is), I thought that this was a brash, extreme request.

**SPOILER: I WOULD BE IMMENSELY, INSANELY WRONG. You'll see what I think should be minimum urban density by the end of this post.**

So, wait, let's run this back a little. What does density have to do with strong cities? (warning for those who read _Country of Cities_: this is going to be some STRONG rephrasing of essentially the entire book's thesis. Sorry, but not sorry, neither Chakrabarti or I hold copyright on basic climate science and urban planning.)

### Why Density Matters

There are essentially two main reasons why density is essential for cities: human sustainability, and environmental sustainability.

##### 1. The Human Angle

We're selfish beings, so let's begin with the human benefits. Without going into excess detail, higher housing density allows for more innovation, productivity, and job growth per unit of area. People are better able to connect with one another, find work, and provide niches of services that would otherwise be impossible to provide. (name one small town with a luxury car dealership, not that you'd ever find me in one of those places) As a result, cities produce MUCH more output per person than rural or suburban areas. While this is erroneously commonly misinterpreted to mean that poor people should generally be unable to live in cities, the opposite is true. A multitude of opportunities for each unit of area is the exact thing poorer people need to rise up in the economic ladder and find success. A multitude of housing types for each unit of area with a broad range of prices is the exact thing that working-class families need to both be able to afford housing, and connect with people who can present them with opportunities. 

Density breeds diversity as well, because oftentimes people of color and immigrants find dense cities places that are most likely to accept their identity and culture, and to provide new-coming workers with a place to grow their careers. In every major city in even a white-majority country like America, there are blocks and neighborhoods with a rich character of the diversity that cities naturally encourage. From Chinatowns and Koreatowns to Littles Italy, Brazil, Dominican Republic, Russia, and more, dense cities will have communities for people of many backgrounds to display their culture, food, and language, which allows more groups of people to connect, form social bonds, and just enjoy life.

Speaking of enjoying life, density provides people with the possibility of numerous types of transport to work, play, and needs, all while making the distance shorter. Try getting to work or the grocery store on foot or on bicycle in New York City, and then try doing it in Levittown, Pennsylvania. Let me know how that goes. And getting back to Chakrabarti's point, the ridership numbers for public transit increase past the point of necessity, making metros, buses, and trams a more reasonable choice for denser areas. All of these travel ease benefits that denser areas provide allow for more people to get out of their cars, get on foot and on their bicycles, and onto transit, causing them to lead a healthier lifestyle, not even intentionally! A consciously healthy person who lives in a suburb and a completely oblivious goober who just walks everywhere in their city will have a nearly identical bill of health, even though the city dweller put almost no effort into "exercising". **City life _is_ the exercise: it's the gym of life.** Obesity rates are consistently lower in cities, especially dense ones, than in rural and suburban areas.

##### 2. The Climate Angle

In the last half century, it has become abundantly clear that the way of life of much of the United States and other developed nations around the world has become unsustainable for the future of the planet. Excessive consumption of fossil fuels have driven much of what we know now as the greenhouse effect, where trapped excess carbon dioxide traps heat within the planet's atmosphere, increasing global temperatures and causing extreme weather events to become more likely, such as heat waves, droughts, storms, earthquakes, and more.

Reduction of fossil fuel consumption is urgent if we want to stay on track to prevent catastrophic warming, and many of the globally suggested ways of doing so can help. We could all simply consume less products, buy less things that we may not need. We could divert our energy consumption to something less carbon-intensive, like solar or wind power. We could achieve this sort of power usage in our own lives by perhaps buying solar panels for our homes, or electric cars.

But what if that wasn't enough? What if our built environment, not just our lifestyles, made our consumption fundamentally incompatible with sustainability? Many of our resources in supplying water, plumbing, electricity, and other essential services are spread out across sparse residential areas across the country, with densities commonly under 15 units per acre. Why does this matter? Because as it turns out, even when consuming "unsustainably", those who live in denser, urban environments still emit less carbon dioxide per capita than those who live in sprawling, suburban environments with all the renewable amenities.

As such, density is one of humanity's true remaining silver bullets to reduce our carbon footprint. A denser city means a more environmentally sustainable one, a less carbon intensive one, a less resource-intensive one.

### My Process

So here I am, wondering what exactly the housing density of a random block in New York City looks like. Luckily, there's a neat little tool that a bunch of nerds in city government (likely me in around ten years) have bestowed upon us internet users: the [ZoLa](https://zola.planning.nyc.gov/), aka the Zoning and Land Use Map of NYC. In extruciating detail, this map shows the land use and information of every square inch of the city, down from building floor count to park acreage.

![Zola Overall](/assets/images/2_zola1.png)

I went to some random block in Park Slope, between 4th and 5th Streets and 5th and 6th Avenues. Covered by three to four-story brownstones, and the F/G/R trains a couple streets away, it's about as average in character as any other Brooklyn block. I _manually_ clicked on every building on the block, went to the information section, added up the square footage of the lot and the number of residential units, and divided the latter total by the former total to get my number. 

![Zola One Block](/assets/images/2_zola2.png)

After several minutes of breaking my fingers on my phone's calculator and browser, I arrived at 69.5 units per acre (nice).

I then imagined how nice it would be to have data on ALL such blocks, in a nice looking map, showing the density gradient of New York's urban fabric in the most detailed possible way.

But I thought to myself: "How is this going to be even **NEARLY** scaleable? There's hundreds of thousands of blocks and MILLIONS of lots..."

I had to make some sort of systematic solution to quickly process every lot in every block if I wanted a map of NYC that takes a few seconds or minutes to make, and not a few years. And what better way to convert huge data into visuals fast than using code?

##### The Data Mason... What Does it Mean???

First things first, I had to get the data from ZoLa somehow if I wanted to do anything systematic in making a map of NYC's density. No matter what kind of godly code I write, it will be useless without a clean and fast way to get data for every lot in the city.

I won't make this very long because, ultimately, this is an urban planning blog, not a programming blog. That's my other major's problem. Essentially, I used the same data request from the NYC planning department's database that ZoLa uses. If we want data from databases, there are two important things to keep in mind: permission, and method.

An [API](https://en.wikipedia.org/wiki/API), or an Application Programming Interface, connects two programs, and more importantly for us, _their data._ This is generally how services connect you, the user, to the data that you may want, in their servers. When ZoLa makes a request to access the NYC planning department's data on a particular lot, it does so using an API.

This particular database is written, and more importantly for us, _accessible_, in [SQL](https://en.wikipedia.org/wiki/SQL). This is a programming language meant to store information, so many databases use it.

Combining our two important aspects of database use, permission and method, we have deduced that we will need to make an API request with a SQL query.

[Here's a longer form](https://github.com/doke05c/NYCDensityMapper/blob/main/guides/data_collection/data_collection_instructions.md) of what I'm about to summarize, and I could not have done this without a friend of mine, a fellow [David](https://github.com/TheEgghead27).

He discovered that upon using Inspect Element, a tool to see how a webpage is wrriten and styled, one can actually see the API request with the SQL queries in the Network view. After modifying the queries a little bit and playing with the results in Insomnia, a program that streamlines the API process, we were able to make a Python program: a request that captures all lot data in the city. We ran it with one command in our computer's terminal, and it downloaded all the data in under a minute.

I had to clean up some of this data at first, because it was primarily filled with inaccuracies. My favorite of these were buildings that were obviously not as dense as they claimed to be. My favorite of these favorites was the error surrounding 23-15 44th Drive, AKA the Court Square Skyline Tower, a luxury 68-floor apartment skyscraper. 

![Skyline Tower](/assets/images/2_skylinetower.jpg)

Notice how many residential units ZoLa claims this building to have.

![Zola Skyline Tower](/assets/images/2_zola3.png)

19201, while impressive-sounding at first, does not make ANY sense when you think about it for more than two milliseconds. How the hell do you get upwards of 200 units per floor? Not even the infamous tenements of Five Points got this dense, and this is **luxury** housing. No, [in reality](https://en.wikipedia.org/wiki/Skyline_Tower_(Queens)), this tower has about 800 condos in its 68 floors, amounting to about 12 units per floor, about reasonable for a standard apartment building. 

Some other buildings, such as those in the Bronx and Manhattan make this error, some of which I was able to catch before final production, and some of which I will never know if they're mistakes. It would be _slightly_ counterproductive to fact-check the number of units of each building of every block. Wasn't the point of this to have my code count these things for me automatically?

Anyhow, there was also the thing of random parks melding themselves into blocks with actual residential density, causing the entire block to have what appeared to be an abysmal total density. At the same time, it also made it appear such that a park somehow had housing in it at all. I obviously wanted neither of these things, so wherever I could, I changed the block number of these parks to a different, unused one, to isolate them from the residential blocks they should never have been in in the first place.


#### [Why don't you go back?](/..)