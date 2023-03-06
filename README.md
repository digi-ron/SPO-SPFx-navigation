# digiron-navigation

## Summary

Simple Navigation solution which uses SPO Theming, a configurable JSON file, and a term store item

## Used SharePoint Framework Version

![version](https://img.shields.io/badge/version-1.16.1-green.svg)

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

> Get your own free development tenant by subscribing to [Microsoft 365 developer program](http://aka.ms/o365devprogram)

## Prerequisites

> node.js, gulp-cli

## Solution

| Solution    | Author(s)                                               |
| ----------- | ------------------------------------------------------- |
| digiron-navigation | Ronnie (digi-ron): [Github](www.github.com/digi-ron) |

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Installation

- Clone this repository
- Ensure that you are at the solution folder
- in the command-line run:
  - **npm i**
  - **gulp serve**
- in your intended SharePoint environment, do the following:
  - make a communication site, and name it anything useful (e.g. Intranet)
  - in that site, either make a document library, or use the "Shared Documents" library for the next step(s)
  - either make or use the included navigation JSON file (in the additional files folder), noting the following structure, and upload to your document library of choice:
    ```
    {
      "value":[
        {
          "friendlyText":"Link to top-level 1",
          "URL":"https://www.your-site.com/path/to/page.aspx"
          "iconRef":"Globe"
          "subItems":[
            {
              "friendlyText":"Link to second level 1",
              "URL":"https://www.your-site.com/path/to/page.aspx"
              "iconRef":"Globe"
            },
            {
              ...
            }
          ]
        },
        {
          ...
        }
      ]
    }
    ```
  - go to the term store and create a term called "NavigationURL". It shouldn't matter where the term itself is, however the extension was created using a Term Group called "Navigation", containing and Term Group called "NavigationSettings", containing the "NavigationURL" term.
  - within the NavigationURL term, set a single Shared Property with the following information:
    - KEY: URL
    - VALUE: "URL-to-your.com/file.json"
  

## Features

- configurable application extension with navigation structure which can be changed on the fly
- heavy use of MS Fluent UI elements and Theme styling (to maintain look and feel of page)

## Limitations
- created within a week as a PoC, no updates planned
- desktop friendly ONLY (menus would need to be rendered as something else entirely to work on mobile due to use of Link top-level menu items which contain a HoverCard element)
- all links open in new tab (can be fixed by changing the NavigationItem interface and corresponding JSON)
- may have benefitted from using a Layer component to anchor object to the top of the screen while users are scrolling (decided this was out of scope, but could be relatively easily implemented)
- heavy reliance on "arrow functions" (depends on personal preference, but if I had more time I think they'd be dedicated functions, preferrably in another class)

## References

- [Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Building for Microsoft teams](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/build-for-teams-overview)
- [Use Microsoft Graph in your solution](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/using-microsoft-graph-apis)
- [Publish SharePoint Framework applications to the Marketplace](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/publish-to-marketplace-overview)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp) - Guidance, tooling, samples and open-source controls for your Microsoft 365 development
