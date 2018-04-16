import React, { Component } from 'react'
import { get, isEmpty, chunk } from 'lodash/fp'
import Icon from '../../Icon'
import { Text, View, TouchableOpacity } from 'react-native'
import { DEFAULT_AVATAR } from '../../../store/models/Community'
import {
  capeCod10
} from '../../../style/colors'

export default class PostCommunities extends Component {
  static defaultState = {
    expanded: false
  }

  constructor (props) {
    super(props)
    this.state = PostCommunities.defaultState
  }

  toggleExpanded = () => {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  render () {
    const { communities, slug } = this.props

    // don't show if there are no communities or this isn't cross posted

    if (isEmpty(communities) || (communities.length === 1 && get('0.slug', communities) === slug)) return null

    const { expanded } = this.state

    const content = expanded
      ? <View style={styles.expandedSection}>
        <View styleName='row'>
          <Text style={styles.label}>Posted In: </Text>
          <TouchableOpacity onPress={this.toggleExpanded}>
            <Icon name='ArrowDown' />
          </TouchableOpacity>
        </View>
        {chunk(2, communities).map(pair => <CommunityRow communities={pair} key={pair[0].id} />)}
      </View>
      : <View style={styles.row}>
        <Text style={styles.label}>Posted In: </Text>
        <CommunityList communities={communities} expandFunc={this.toggleExpanded} />
        <TouchableOpacity onPress={this.toggleExpanded}>
          <Icon name='ArrowDown' />
        </TouchableOpacity>
      </View>

    return <View style={[styles.communities, expanded && styles.expanded]}>
      {content}
    </View>
  }
}

export function CommunityList ({communities, expandFunc}) {
  return <View>
    <Text>CommunityList</Text>
  </View>
}

export function CommunityRow ({communities}) {
  return <View>
    <Text>CommunityList</Text>
  </View>
}

const styles = {
  communities: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: capeCod10
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  }
  // blah: {
  //   color: rhino80,
  //   fontSize: 18,
  //   fontFamily: 'Circular-Book',
  //   marginRight: 8
  // },
  // blah: {
  //   paddingLeft: 6,
  //   color: rhino30,
  //   fontSize: 13,
  //   fontFamily: 'Circular-Book'
  // },
  // blah: {
  //   blah: {
  //     paddingRight: 14,
  //     paddingLeft: 14,
  //     height: 40,
  //     flexDirection: 'row',
  //     alignItems: 'center'
  //   },
  //   blah: {
  //     fontSize: 18,
  //     marginRight: 4
  //   },
  //   blah: {
  //     fontSize: 14
  //   },
  //   blah: {
  //     color: caribbeanGreen,
  //     fontFamily: 'Circular-Bold'
  //   },
  //   blah: {
  //     color: slateGrey80,
  //     fontFamily: 'Circular-Book'
  //   }
  // }
}
