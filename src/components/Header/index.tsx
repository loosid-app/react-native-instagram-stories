import React, { FC, memo, useMemo, useState } from 'react';
import {
  View, Text, Image, TouchableOpacity,
  Pressable,
} from 'react-native';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';

import { WIDTH } from '../../core/constants';
import HeaderStyles from './Header.styles';
import { StoryHeaderProps } from '../../core/dto/componentsDTO';
import Close from '../Icon/close';

const StoryHeader: FC<StoryHeaderProps> = ( {
  avatarSource, name, onClose, avatarSize, textStyle, closeColor, headerStyle, ownStory,
  headerContainerStyle, renderStoryHeader, onStoryHeaderPress, renderPlayControlButton, stories, active, activeStory
} ) => {

  const styles = { width: avatarSize, height: avatarSize, borderRadius: avatarSize };
  const width = WIDTH - HeaderStyles.container.left * 2;


  const [ storyIndex, setStoryIndex ] = useState( 0 );

  const onChange = async () => {

    'worklet';

    const index = stories.findIndex( ( item ) => item.id === activeStory.value );
    if ( active?.value && index >= 0 && index !== storyIndex ) {

      runOnJS( setStoryIndex )( index );

    }

  };

  useAnimatedReaction(
    () => active?.value,
    ( res, prev ) => res !== prev && onChange(),
    [ active?.value, onChange ],
  );

  useAnimatedReaction(
    () => activeStory.value,
    ( res, prev ) => res !== prev && onChange(),
    [ activeStory.value, onChange ],
  );
  
  if ( renderStoryHeader ) {

    return (
      <View
        style={[ HeaderStyles.container, { width }, headerContainerStyle ]}
      >
        {renderStoryHeader()}
      </View>
    );

  }

 const { headerString, storyId } = useMemo( () => {
  
    const currentStory = stories?.[storyIndex];

    return {
    headerString: currentStory?.headerTitle || name,
    storyId: currentStory?.id
  }}, [ storyIndex, name ] );

  return (
    <View style={[
      HeaderStyles.container, HeaderStyles.containerFlex,
      { width }, headerContainerStyle,
    ]}
    >
      <Pressable style={[ HeaderStyles.left, headerStyle ]} onPress={() => onStoryHeaderPress?.()}>
        {( Boolean( avatarSource ) ) && (
          <View style={[ HeaderStyles.avatar, { borderRadius: styles.borderRadius } ]}>
            <Image source={avatarSource!} style={styles} />
          </View>
        )}
        {Boolean( headerString ) && <Text style={textStyle}>{headerString}</Text>}
      </Pressable>
      
      {renderPlayControlButton && renderPlayControlButton( storyId, ownStory )}

      <TouchableOpacity
        onPress={onClose}
        hitSlop={16}
        testID="storyCloseButton"
      >
        <Close color={closeColor} />
      </TouchableOpacity>
    </View>
  );

};

export default memo( StoryHeader );
