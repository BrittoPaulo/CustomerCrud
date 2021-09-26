import React, {useState} from 'react';
import {
  ActivityIndicator,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';

function ButtonFilter({
  disabled = false,
  buttonTitle,
  selected = true,
  onPress = () => null,
  style,
  color = '#00843d',
  textColor = '#fff',
  reverseColorOnPress = false,
  textStyle,
  backgroundColor = null,
  loading = false,
}) {
  let [_backgroundColor, setBackgroundColor] = useState(color);
  let [_textColor, setTextColor] = useState(textColor);
  let [isSelected, setSelected] = useState(selected);
  function _reverseColor() {
    setBackgroundColor(_textColor);
    setTextColor(_backgroundColor);
  }

  function _onPressButton() {
    if (reverseColorOnPress) {
      _reverseColor();
    }
    setSelected(!isSelected);
    onPress();
  }
  return (
    <TouchableOpacity
      style={{backgroundColor}}
      disabled={disabled}
      onPress={_onPressButton}>
      <View
        style={[
          styles.default,
          {
            borderColor: color,
            backgroundColor: selected ? _backgroundColor : _textColor,
          },
          style,
        ]}>
        {!loading && (
          <Text
            style={[
              {
                color: selected ? _textColor : _backgroundColor,
                textAlign: 'center',
                fontWeight: '700',
              },
              textStyle,
            ]}>
            {buttonTitle}
          </Text>
        )}
        {loading && (
          <ActivityIndicator style={{padding: 10}} size="large" color="#fff" />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  default: {
    width: 200,
    borderWidth: 1,
    borderRadius: 30,
    margin: 5,
    marginTop: 0,
    height: 30,
  },
});
export default ButtonFilter;
