import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer, PlaceholderContent, PlaceholderName
} from '@microsoft/sp-application-base';
import * as strings from 'DigironNavCustomizerApplicationCustomizerStrings';
import { spfi, SPFx } from '@pnp/sp';
import { SPFI } from '@pnp/sp/fi';
import '@pnp/sp/webs';
import '@pnp/sp/files/web';
import NavigationRoot from './NavigationElements';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import "@pnp/sp/taxonomy";
import { Dialog } from '@microsoft/sp-dialog';
import NavigationHelpers from './NavigationHelpers';

const LOG_SOURCE: string = 'DigironNavCustomizerApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IDigironNavCustomizerApplicationCustomizerProperties {
  //left blank to allow for someone adding their own thing in here
  navigationURL: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class DigironNavCustomizerApplicationCustomizer
  extends BaseApplicationCustomizer<IDigironNavCustomizerApplicationCustomizerProperties> {
  private _navigationElement: NavigationRoot;
  private _topPlaceholder: PlaceholderContent | undefined;
  private sp: SPFI;

  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    //pnpsp init
    this.sp = spfi().using(SPFx(this.context));
    this.GetNavigationJSONURL().catch((e) => { Log.error(LOG_SOURCE, e);});
    
    return Promise.resolve();
  }

  //all functions below here rely on this.sp - if you want a helper file for this functionality make sure you have a SPFI object made for it
  private async GetNavigationJSONURL() : Promise<void> {
    let output: string = "";
    /* how this works:
      - search for the term "NavigationURL"
      - use that information to get the children of the set above it
      - then use that to get the sets child information about that single child, with the relevant columns selected
      - then run the rest of the config functions I've spread through this file
      NOTE: I'm not sure if this is the best way, it was the first way to work though
    */
    this.sp.termStore.searchTerm({label: "NavigationURL"}).then((locatedTerm) => {
      this.sp.termStore.sets.getById(locatedTerm[0].set.id).children.filter(`id Eq '${locatedTerm[0].id}'`).select('id','labels','properties','localProperties','ShortName')().then((information) => {
        output = information[0].properties.filter((props) => {
          return props.key === "URL";
        })[0].value;
        if (output === "") {
          Log.error(LOG_SOURCE, {message:"ERROR: NavigationURL not set in term store!!!", name:LOG_SOURCE});
          Dialog.alert("ERROR: NavigationURL not set in term store!!!").catch(() => {
            //console error because this is no-mans land
            console.error("somehow this webpart is so cooked you can't even show a dialog? Good luck and godspeed soldier");
          });
        }
        else
        {
          this.ConfigureNavigation(output).catch((e) => Log.error(LOG_SOURCE, {name: LOG_SOURCE, message: "ERROR: Navigation Configuration - " + e}));
        }

      }).catch((e) => {Log.error(LOG_SOURCE, {name: LOG_SOURCE, message: "ERROR: Can't retrieve Term set from collected Term item - " + e});});
    }).catch((e) => {Log.error(LOG_SOURCE, {name: LOG_SOURCE, message: "ERROR: Can't retrieve NavigationURL term in term store - " + e});});
  }

  private async ConfigureNavigation(inputURL: string): Promise<void> {
    this.sp.web.getFileByUrl(inputURL).getText().then((rawInformation: string) => {
      this._navigationElement = NavigationHelpers.ProcessNavigationElement(rawInformation);
      this.ApplyNavToTopElement().catch((e) => Log.error(LOG_SOURCE, {name: LOG_SOURCE, message: "ERROR: Navigation Rendering - " + e}));
    }).catch((e) => Log.error(LOG_SOURCE, {name: LOG_SOURCE, message: "ERROR: Config File Collection - " + e}));
  }

  //set up placeholder: https://learn.microsoft.com/en-us/sharepoint/dev/spfx/extensions/get-started/using-page-placeholder-with-extensions
  private async ApplyNavToTopElement(inputNavInfo: NavigationRoot = this._navigationElement) : Promise<void> {
    this.context.placeholderProvider.changedEvent.add(this, (eargs) => {
      if(!this._topPlaceholder) {
        this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Top, {onDispose: this.onDispose});
      }
      if (!this._topPlaceholder) {
        Log.error(LOG_SOURCE, {name: LOG_SOURCE, message: "ERROR: Top Placeholder DOM element not created!"});
      }
      //for some reason this doesn't like react/react-dom v17, I'm using v16.13.1, hopefully this works in later versions otherwise this is the biggest point of failure going forwards
      const navInfo = React.createElement(NavigationRoot, inputNavInfo.props, "");
      this._navigationElement = ReactDOM.render(navInfo, this._topPlaceholder.domElement);
      Log.info(LOG_SOURCE, "Navigation Component loaded and applied");
    });
  }
}
