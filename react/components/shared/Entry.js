import React from 'react';

import {
    View,
    Image,
    Text
} from "react-native";

import { useTheme } from '@react-navigation/native';
import { TouchableRipple } from 'react-native-paper';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { resultStyle } from '../../styles/Search';
import { showModal } from '../modals/MoreModal';
import Navigation from '../../services/ui/Navigation';

export default Entry = ({ entry, navigation, index, forcedPlaylistId }) => {
    const { title, subtitle, artist, thumbnail, artwork,
            videoId, id, browseId, playlistId } = entry;

    const view = {
        title: title,
        subtitle: subtitle || artist,
        thumbnail: thumbnail || artwork,
        videoId: videoId || id,
        browseId: browseId,
        playlistId: forcedPlaylistId
            ? forcedPlaylistId
            : playlistId,
    };

    const { colors } = useTheme();

    return <TouchableRipple
        borderless={true}
        rippleColor={colors.primary}
        onPress={() => Navigation.handleMedia(view, navigation)}
        onLongPress={() => showModal(view)}

        style={{
            marginHorizontal: 5,
            marginBottom: 10,
            borderRadius: 5,
            height: 70,
            backgroundColor: colors.card,
            flexDirection: 'row',
        }}
    >
        <>
        {
            index != undefined
                ? <Text style={{
                    width: 30,
                    textAlign: "center",
                    alignSelf: "center",
                    color: colors.text
                }}>
                    {index}
                </Text>

                : null
        }

        <Image 
            style={resultStyle.resultCover}
            progressiveRenderingEnabled={true}
            source={{uri: thumbnail || artwork}}
        />

        <View style={resultStyle.resultColumnOne}>
            <Text numberOfLines={1} style={[resultStyle.resultText, {color: colors.text}]}>{title}</Text>
            <Text numberOfLines={1} style={[resultStyle.resultText, {color: colors.text}]}>{view.subtitle}</Text>
        </View>

        <TouchableRipple
            borderless={true}
            rippleColor={colors.primary}
            onPress={() => showModal(view)}
            style={{
                justifyContent: "center",
                borderRadius: 25,
                alignSelf: "center",
                alignItems: "center",
                width: 50,
                height: 50,
                margin: 0,
                padding: 0
            }}
        >
            <MaterialIcons name="more-vert" color={colors.text} size={24}/>
        </TouchableRipple>
        
        </>
    </TouchableRipple>;
}