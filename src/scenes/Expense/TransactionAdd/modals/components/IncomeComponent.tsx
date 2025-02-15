import { View, Text, TouchableOpacity, FlatList, Image, ImageSourcePropType } from 'react-native'
import React from 'react'
import useArray from '../../../../../hooks/useArray'
import { TransactionCategory } from '../../../../../models/Transaction'
import { BASE64_IMAGES } from '../../../../../storages/Base64Images';
import { CATEGORY_TYPE } from '../../../../../constants/Status';
import { getImageAsBase64 } from '../../../../../utils/ImageUtils';

interface IncomeComponentProps {
  onItemPress: (item: TransactionCategory) => void;
  onAddPress: () => void;
  dataDefault: TransactionCategory;
}

const IncomeComponent = ({ onItemPress, onAddPress, dataDefault }: IncomeComponentProps) => {

  const [idSelected, setIdSelected] = React.useState<string | number>(0)

  const incomes = useArray<TransactionCategory>([
    new TransactionCategory({ categoryId: CATEGORY_TYPE.INCOME.SALARY, isIncome: true, categoryName: 'Tiền lương', categorySource: BASE64_IMAGES.salary }),
    new TransactionCategory({ categoryId: CATEGORY_TYPE.INCOME.BONUS, isIncome: true, categoryName: 'Tiền thưởng', categorySource: BASE64_IMAGES.bonus }),
    new TransactionCategory({ categoryId: CATEGORY_TYPE.INCOME.INVEST, isIncome: true, categoryName: 'Tiền đầu tư', categorySource: BASE64_IMAGES.invest }),
    new TransactionCategory({ categoryId: CATEGORY_TYPE.INCOME.OTHER_MONEY, isIncome: true, categoryName: 'Tiền khác', categorySource: BASE64_IMAGES.other_money }),
  ])

  React.useEffect(() => {
    if (!dataDefault.isIncome) {
      setIdSelected(0)
      return
    } else {
      setIdSelected(dataDefault.categoryId)
    }
  }, [dataDefault])

  React.useEffect(() => {
    const addElement = incomes.array.findIndex((item) => item.categoryId === CATEGORY_TYPE.INCOME.ADD_OTHER)
    if (addElement !== -1) { incomes.removeAt(addElement) }
    incomes.push(new TransactionCategory({ categoryId: CATEGORY_TYPE.INCOME.ADD_OTHER, categoryName: '', categorySource: require('../../../../../assets/icons/plus-blue-2.png') }))
  }, [])

  const handleSelected = (selected: TransactionCategory) => {
    if (selected.categoryId !== CATEGORY_TYPE.INCOME.ADD_OTHER) {
      const condition = selected.categoryId === idSelected || selected.categoryId === CATEGORY_TYPE.INCOME.ADD_OTHER ? 0 : selected.categoryId
      setIdSelected(condition)
      onItemPress(condition === 0 ? new TransactionCategory({ categoryId: 0 }) : selected)
    } else {
      onAddPress()
    }
  }

  return (
    <View className='items-center justify-center flex-1 px-1 py-2 bg-gray-800'>
      <FlatList
        data={incomes.array}
        showsVerticalScrollIndicator={false}
        numColumns={3}
        keyExtractor={(item) => item.categoryId.toString()}
        renderItem={({ item }) => {
          const isSelected = idSelected === item.categoryId && item.categoryId !== CATEGORY_TYPE.INCOME.ADD_OTHER
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

export default IncomeComponent