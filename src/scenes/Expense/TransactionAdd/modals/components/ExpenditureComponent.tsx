import { View, Text, FlatList, Image, TouchableOpacity, ImageSourcePropType } from 'react-native'
import React from 'react'
import useArray from '../../../../../hooks/useArray'
import { TransactionCategory } from '../../../../../models/Transaction';
import { BASE64_IMAGES } from '../../../../../storages/Base64Images';
import { CATEGORY_TYPE } from '../../../../../constants/Status';
import { getImageAsBase64 } from '../../../../../utils/ImageUtils';
interface ExpenditureComponentProps {
  onItemPress: (item: TransactionCategory) => void;
  onAddPress: () => void;
  dataDefault: TransactionCategory;
}

const ExpenditureComponent = ({ onItemPress, onAddPress, dataDefault }: ExpenditureComponentProps) => {

  const [idSelected, setIdSelected] = React.useState<string | number>(0)

  const expenditures = useArray<TransactionCategory>([
    new TransactionCategory({ categoryId: CATEGORY_TYPE.EXPENSE.FOOD, categoryName: 'Thực phẩm', categorySource: BASE64_IMAGES.food }),
    new TransactionCategory({ categoryId: CATEGORY_TYPE.EXPENSE.MOVING, categoryName: 'Di chuyển', categorySource: BASE64_IMAGES.moving }),
    new TransactionCategory({ categoryId: CATEGORY_TYPE.EXPENSE.FASHION, categoryName: 'Thời trang', categorySource: BASE64_IMAGES.fashion }),
    new TransactionCategory({ categoryId: CATEGORY_TYPE.EXPENSE.PET, categoryName: 'Thú cưng', categorySource: BASE64_IMAGES.pet }),
    new TransactionCategory({ categoryId: CATEGORY_TYPE.EXPENSE.EDUCATION, categoryName: 'Giáo dục', categorySource: BASE64_IMAGES.education }),
    new TransactionCategory({ categoryId: CATEGORY_TYPE.EXPENSE.HEALTH, categoryName: 'Sức khỏe', categorySource: BASE64_IMAGES.health }),
    new TransactionCategory({ categoryId: CATEGORY_TYPE.EXPENSE.TRAVEL, categoryName: 'Du lịch', categorySource: BASE64_IMAGES.travel }),
    new TransactionCategory({ categoryId: CATEGORY_TYPE.EXPENSE.ENTERTAINMENT, categoryName: 'Giải trí', categorySource: BASE64_IMAGES.entertainment }),
    new TransactionCategory({ categoryId: CATEGORY_TYPE.EXPENSE.GIFT, categoryName: 'Quà tặng', categorySource: BASE64_IMAGES.gift }),
    new TransactionCategory({ categoryId: CATEGORY_TYPE.EXPENSE.ELECTRICITY_BILL, categoryName: 'Hóa đơn', categorySource: BASE64_IMAGES.electricity_bill }),
  ])

  React.useEffect(() => {
    if (dataDefault.isIncome) {
      setIdSelected(0)
      return
    } else {
      setIdSelected(dataDefault.categoryId)
    }
  }, [dataDefault])

  React.useEffect(() => {
    const addElement = expenditures.array.findIndex((item) => item.categoryId === CATEGORY_TYPE.EXPENSE.ADD_OTHER)
    if (addElement !== -1) { expenditures.removeAt(addElement) }
    expenditures.push(new TransactionCategory({ categoryId: CATEGORY_TYPE.EXPENSE.ADD_OTHER, categoryName: '', categorySource: require('../../../../../assets/icons/plus-blue-2.png') }))
  }, [])

  const handleSelected = (selected: TransactionCategory) => {
    if (selected.categoryId !== CATEGORY_TYPE.EXPENSE.ADD_OTHER) {
      const condition = selected.categoryId === idSelected || selected.categoryId === CATEGORY_TYPE.EXPENSE.ADD_OTHER ? 0 : selected.categoryId
      setIdSelected(condition)
      onItemPress(condition === 0 ? new TransactionCategory({ categoryId: 0 }) : selected)
    } else {
      onAddPress()
    }
  }

  return (
    <View className='flex items-center justify-center h-full p-2 bg-gray-800'>
      <FlatList
        data={expenditures.array}
        showsVerticalScrollIndicator={false}
        numColumns={3}
        keyExtractor={(item) => item.categoryId.toString()}
        renderItem={({ item }) => {
          const isSelected = idSelected === item.categoryId && item.categoryId !== CATEGORY_TYPE.EXPENSE.ADD_OTHER
          return (
            <TouchableOpacity className='w-1/3 h-32 p-1' onPress={() => handleSelected(item)}>
              <View
                className={
                  `p-1 gap-y-1 items-center justify-center w-full h-full rounded-xl
                    ${isSelected ? 'border-2 border-pink-300 bg-pink-100' : 'bg-gray-900'}`
                }
              >
                <Image
                  className='w-[60] h-[60]'
                  source={
                    item.categorySource instanceof Object
                      ? { uri: `data:image/png;base64,${getImageAsBase64(Object.values(item.categorySource) as any)}` }
                      : (
                        typeof item.categorySource === 'string'
                          ? { uri: `data:image/png;base64,${item.categorySource}` }
                          : (item.categorySource as ImageSourcePropType)
                      )
                  }
                />
                {item.categoryName !== '' && <Text className={`text-center ${isSelected ? 'text-pink-500' : 'text-white'}`}>{item.categoryName}</Text>}
              </View>
            </TouchableOpacity>
          )
        }}
      />
    </View>
  )
}

export default ExpenditureComponent