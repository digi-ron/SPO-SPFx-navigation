import * as React from "react";
import { NavigationItem, NavigationObject } from "./NavigationSchema";
import { Link, Stack, HoverCard, HoverCardType, IPlainCardProps, DirectionalHint, FontIcon} from '@fluentui/react';
import styles from './NavigationStyles.module.scss'

export interface NavigationRootProps {
    navigationSchema: NavigationObject;
}

export interface NavigationRootState {
    
}

export default class NavigationRoot extends React.Component<NavigationRootProps, NavigationRootState> {

    constructor(props:NavigationRootProps) {
        super(props);
    }

    render() : JSX.Element {
        return (
            <div>
                <Stack horizontal wrap verticalAlign="center" horizontalAlign="space-evenly">
                    {this.props.navigationSchema.value.map((currentNavigationItem) => {
                        const hoverCardProps: IPlainCardProps = {
                            renderData: currentNavigationItem,
                            directionalHintFixed: false,
                            directionalHint: DirectionalHint.bottomCenter,
                            styles: {"root": {minWidth: "175px", textAlign: "center"}},
                            onRenderPlainCard: (item: NavigationItem): JSX.Element => {
                                return (
                                    <div>
                                        {item.subItems && item.subItems.map((secondLevelItem, secondIndex) => {
                                            return (
                                                <div>
                                                    <Link 
                                                    className={styles.secondLevelHeadings}
                                                    href={secondLevelItem.URL}
                                                    target="_blank"
                                                    >
                                                        {this._friendlyTextTruncator(secondLevelItem.friendlyText)}
                                                    </Link>
                                                    {secondLevelItem.subItems.length > 0 && <hr/>}
                                                    {secondLevelItem.subItems.map((thirdLevelItem) => {
                                                        return (
                                                            <div>
                                                                <FontIcon aria-label={thirdLevelItem.friendlyText} iconName={thirdLevelItem.iconRef}/>
                                                                <Link
                                                                    href={thirdLevelItem.URL}
                                                                    target="_blank"
                                                                    >
                                                                    &nbsp;&nbsp;{this._friendlyTextTruncator(thirdLevelItem.friendlyText)}
                                                                </Link>
                                                                <br/>
                                                            </div>
                                                        );
                                                    })}
                                                    {secondIndex < item.subItems.length - 1 && <ul/>}
                                                </div>
                                            )
                                        })}
                                    </div>
                                )
                            }
                        }
                        return (
                            <Stack.Item align="stretch" grow={3} shrink={0} className={styles.topLevelButtons}>
                                <Link
                                    href={currentNavigationItem.URL}
                                    target="_blank"
                                    className={styles.topLevelLinks}>
                                    <HoverCard
                                        cardDismissDelay={300}
                                        type={HoverCardType.plain}
                                        plainCardProps={hoverCardProps}
                                        >
                                        <div className={styles.topLevelNavigation}>
                                            <FontIcon aria-label={currentNavigationItem.friendlyText} iconName={currentNavigationItem.iconRef}/>
                                            &nbsp;&nbsp;{this._friendlyTextTruncator(currentNavigationItem.friendlyText)}
                                        </div>
                                    </HoverCard>
                                </Link>
                            </Stack.Item>
                        );
                    })}
                </Stack>
            </div>
        );
    }

    private _friendlyTextTruncator(inputString: string, truncateLength: number = 40): string {
        let output: string = inputString.substring(0, truncateLength - 1);

        if (inputString.length > truncateLength) {
            output = output.concat("...");
        }

        return output
    }
}