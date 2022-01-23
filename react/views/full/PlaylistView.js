import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    Image,
    Pressable
} from "react-native";
import { useTheme, useFocusEffect } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import Media from "../../services/api/Media";
import {
    bottomBarStyle,
    bottomBarAlbumStyle
} from "../../styles/BottomBar";
import { rippleConfig } from "../../styles/Ripple";
import Navigation from "../../services/ui/Navigation";
import FlatEntries from "../../components/collections/FlatEntries";
import { ActivityIndicator } from "react-native-paper";
import Downloads from "../../services/device/Downloads";

export default PlaylistView = ({ route, navigation }) => {
    const {colors} = useTheme();
    const [playlist, setPlaylist] = useState(null);
    const idFits = route.params?.list == Navigation.transitionPlaylist?.playlistId ||
                   route.params?.list == Navigation.transitionPlaylist?.browseId;

    useFocusEffect(
        useCallback(() => {
            if (!route.params.hasOwnProperty("list"))
                navigation.pop();

            if (idFits)
                navigation.setOptions({ title: Navigation.transitionPlaylist.title });

            if (playlist == null || !idFits) {
                if (!route.params.list.startsWith("LOCAL")) {
                    Media.getBrowseData(route.params.list)
                        .then(playlist => {
                            navigation.setOptions({ title: playlist.title });
                            navigation.setParams({ list: playlist.playlistId});
                            setPlaylist(playlist);
                        });
                } else {
                    Downloads.loadLocalPlaylist(route.params.list)
                        .then(localPlaylist => {
                            let playlist = {
                                playlistId: localPlaylist.playlistId,
                                title: localPlaylist.title,
                                subtitle: localPlaylist.subtitle,
                                secondSubtitle: localPlaylist.secondSubtitle,
                                entries: localPlaylist.list
                            };

                            navigation.setOptions({ title: playlist.title });
                            navigation.setParams({ list: playlist.playlistId});
                            setPlaylist(playlist);
                        });
                }
            }
                
        }, [])
    )

    var entries;
    if (playlist != null)
        entries = playlist.entries;
    else
        entries = [];
    
    return <>
        {
            playlist == null
            ? <View style={{flex: 1, justifyContent: "center"}}>
                <ActivityIndicator/>
            </View>

            : <FlatEntries
                entries={entries}
                isPlaylist={true}
                playlistId={route.params.list}
                navigation={navigation}
            />
        }

        <View style={{
            alignSelf: "stretch",
            alignItems: "stretch",
            justifyContent: "space-evenly",
            backgroundColor: colors.card,
            width: "100%"
        }}>
            <View style={bottomBarStyle.topRow}>
                <Image style={bottomBarAlbumStyle.albumCover} source={{
                    uri: idFits && playlist == null
                        ? Navigation.transitionPlaylist?.thumbnail
                        : playlist?.thumbnail
                }}/>

                <View>
                    {
                        playlist == null
                        ? <>
                            {
                                idFits
                                    ? <Text numberOfLines={1} style={[bottomBarAlbumStyle.albumTitle, bottomBarAlbumStyle.albumText, {color: colors.text}]}>
                                        {Navigation.transitionPlaylist.title}
                                    </Text>
                                    : <View style={{width: 250, height: 20, marginBottom: 2, backgroundColor: colors.text}}/>
                            }
                            
                            <View style={{width: 200, height: 20, marginBottom: 2, backgroundColor: colors.text}}/>
                            <View style={{width: 230, height: 20, marginBottom: 2, backgroundColor: colors.text}}/>
                        </>
                        : <>
                            <Text numberOfLines={1} style={[bottomBarAlbumStyle.albumTitle, bottomBarAlbumStyle.albumText, {color: colors.text}]}>
                                {playlist.title}
                            </Text>
                            <Text numberOfLines={1} style={[bottomBarAlbumStyle.albumSubtitle, bottomBarAlbumStyle.albumText, {color: colors.text}]}>
                                {playlist.subtitle}
                            </Text>
                            <Text numberOfLines={1} style={[bottomBarAlbumStyle.albumInfo, bottomBarAlbumStyle.albumText, {color: colors.text}]}>
                                {playlist.secondSubtitle}
                            </Text>
                        </>
                    }
                </View>
                <Pressable android_ripple={rippleConfig} style={[bottomBarStyle.closeButton, {backgroundColor: colors.border}]}
                            onPress={() => navigation.pop()}>
                    <MaterialIcons name="arrow-back" color={colors.text} size={20}/>
                </Pressable>
            </View>

            <View style={{
                    flexDirection: "row",
                    alignSelf: "stretch",
                    alignItems: "center",
                    alignContent: "center",
                    justifyContent: "space-evenly",
                    paddingVertical: 10
            }}>
                <Pressable android_ripple={rippleConfig} style={[bottomBarStyle.button, {backgroundColor: colors.border}]}>
                    <Text style={[bottomBarStyle.buttonText, {color: colors.text}]}>PLAY</Text>
                </Pressable>
                <Pressable android_ripple={rippleConfig} style={[bottomBarStyle.button, {backgroundColor: colors.border}]}>
                    <Text style={[bottomBarStyle.buttonText, {color: colors.text}]}>ADD TO LIBRARY</Text>
                </Pressable>
                <Pressable android_ripple={rippleConfig} style={[bottomBarStyle.button, {backgroundColor: colors.border}]}>
                    <Text style={[bottomBarStyle.buttonText, {color: colors.text}]}>SHARE</Text>
                </Pressable>
            </View>
        </View>
    </>
}