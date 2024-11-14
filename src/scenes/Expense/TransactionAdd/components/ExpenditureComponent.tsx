import { View, Text, FlatList, Image, TouchableOpacity, ImageSourcePropType } from 'react-native'
import React from 'react'
import useArray from '../../../../hooks/useArray'
import { TransactionCategory } from '../../../../types/Transaction';
import { ImageLibraryOptions, launchImageLibrary } from 'react-native-image-picker';

interface ExpenditureComponentProps {
  onItemPress: (item: TransactionCategory) => void;
}

const ExpenditureComponent = ({ onItemPress }: ExpenditureComponentProps) => {

  const [idSelected, setIdSelected] = React.useState<string | number>(0)

  const expenditures = useArray<TransactionCategory>([
    new TransactionCategory({ category_id: 2, category_name: 'Thực phẩm', category_source: require('../../../../assets/images/food.png') }),
    new TransactionCategory({ category_id: 3, category_name: 'Chế độ ăn', category_source: require('../../../../assets/images/eating.png') }),
    new TransactionCategory({ category_id: 4, category_name: 'Di chuyển', category_source: require('../../../../assets/images/moving.png') }),
    new TransactionCategory({ category_id: 5, category_name: 'Thời trang', category_source: require('../../../../assets/images/fashion.png') }),
    new TransactionCategory({ category_id: 6, category_name: 'Chế độ uống', category_source: require('../../../../assets/images/drink.png') }),
    new TransactionCategory({ category_id: 7, category_name: 'Thú cưng', category_source: require('../../../../assets/images/pet.png') }),
    new TransactionCategory({ category_id: 8, category_name: 'Giáo dục', category_source: require('../../../../assets/images/education.png') }),
    new TransactionCategory({ category_id: 9, category_name: 'Sức khỏe', category_source: require('../../../../assets/images/health.png') }),
    new TransactionCategory({ category_id: 10, category_name: 'Du lịch', category_source: require('../../../../assets/images/travel.png') }),
    new TransactionCategory({ category_id: 11, category_name: 'Giải trí', category_source: require('../../../../assets/images/entertainment.png') }),
    new TransactionCategory({ category_id: 12, category_name: 'Hóa đơn nước', category_source: require('../../../../assets/images/water-bill.png') }),
    new TransactionCategory({ category_id: 13, category_name: 'Hóa đơn điện', category_source: require('../../../../assets/images/electricity-bill.png') }),
    new TransactionCategory({ category_id: 14, category_name: 'Hóa đơn internet', category_source: require('../../../../assets/images/internet-bill.png') }),
    new TransactionCategory({ category_id: 15, category_name: 'Quà tặng', category_source: require('../../../../assets/images/gift.png') })
  ])

  React.useEffect(() => {
    const addElement = expenditures.array.findIndex((item) => item.category_id === 1)
    if (addElement !== -1) { expenditures.removeAt(addElement) }
    expenditures.push(new TransactionCategory({ category_id: 1, category_name: '', category_source: require('../../../../assets/icons/plus-blue-2.png') }))
  }, [])

  const handleSelected = (selected: TransactionCategory) => {
    const condition = selected.category_id === idSelected || selected.category_id === 1 ? 0 : selected.category_id
    setIdSelected(condition)
    if (selected.category_id === 1) {
      openMediaPicker()
    } else {
      onItemPress(selected)
    }
  }

  const openMediaPicker = () => {
    const option: ImageLibraryOptions = { mediaType: 'photo', includeBase64: true }
    launchImageLibrary(
      option, response => {
        if (response.didCancel) {
          console.log('User cancelled image selection');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorCode);
        } else {
          if (!response.assets) { return }
          console.log('ImagePicker Response: ', response.assets[0].base64);
        }
      }
    )
  }

  return (
    <View className='items-center justify-center flex-1 px-1 py-2'>
      <FlatList
        data={expenditures.array}
        showsVerticalScrollIndicator={false}
        numColumns={3}
        keyExtractor={(item) => item.category_id.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity className='w-1/3 h-32 p-1' onPress={() => handleSelected(item)}>
              <View
                className={
                  `p-1 gap-y-1 items-center justify-center w-full h-full rounded-xl
                    ${idSelected === item.category_id ? 'border-2 border-pink-300 bg-pink-100' : 'bg-white'}`
                }
              >
                <Image
                  className='w-[60] h-[60]'
                  {...(typeof item.category_source === 'string' ? ({
                    uri: item.category_source
                  }) : ({
                    source: item.category_source as ImageSourcePropType
                  }))}
                />
                {item.category_name !== '' && <Text className={`text-center ${idSelected === item.category_id ? 'text-pink-500' : 'text-gray-500'}`}>{item.category_name}</Text>}
              </View>
            </TouchableOpacity>
          )
        }}
      />
    </View>
  )
}

export default ExpenditureComponent