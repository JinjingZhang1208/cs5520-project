import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CommonStyles from '../styles/CommonStyles';
import ImageManager from './ImageManager';
import PressableButton from './PressableButton';

export default function ImageInput({imageModalVisible, dismissModal, receiveImageURI, updateURI}) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={imageModalVisible}
            onRequestClose={() => dismissModal()}>
        <View style={CommonStyles.centeredView}>
            <View style={CommonStyles.modalView}>
                <ImageManager receiveImageURI={receiveImageURI} updateURI={updateURI}/>
                <PressableButton
                    customStyle={{...CommonStyles.pressableButtonStyle, backgroundColor: 'gray'}}
                    onPress={() => dismissModal()}>
                    <Text>Cancel</Text>
                </PressableButton>
            </View>
        </View>
    </Modal>
  )
}

const styles = StyleSheet.create({})