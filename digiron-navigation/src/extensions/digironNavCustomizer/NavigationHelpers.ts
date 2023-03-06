import NavigationRoot from "./NavigationElements";
import { NavigationObject } from "./NavigationSchema";

export default class NavigationHelpers {
    public static ProcessNavigationElement(inputString: string) : NavigationRoot {
        const JSONObject: NavigationObject = JSON.parse(inputString);
        const output: NavigationRoot = new NavigationRoot({navigationSchema:JSONObject});
        return output;
      }
}