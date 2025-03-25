import React, { Component } from 'react'
import { Text, View } from 'react-native'
import Navbar from './Navbar'
import Subcategory from './Subcategory'
import CsCards from './Subcategory'

export class Home extends Component {
  render() {
    return (
        <>

      <View>
        <Navbar/>
        <CsCards/>
        <Text> Home Component </Text>
      </View>
      </>
    )
  }
}

export default Home
