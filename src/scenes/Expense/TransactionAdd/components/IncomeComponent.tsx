import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native'
import React from 'react'
import useArray from '../../../../hooks/useArray'
import { TransactionCategory } from '../../../../types/Transaction'

interface IncomeComponentProps {
  onItemPress: (item: TransactionCategory) => void;
}

const IncomeComponent = ({ onItemPress }: IncomeComponentProps) => {

  const [idSelected, setIdSelected] = React.useState<string | number>(0)

  const incomes = useArray<TransactionCategory>([
    new TransactionCategory({ category_id: 2, is_income: true, category_name: 'Tiền lương', category_source: require('../../../../assets/images/salary.png') }),
    new TransactionCategory({ category_id: 3, is_income: true, category_name: 'Tiền thưởng', category_source: require('../../../../assets/images/bonus.png') }),
    new TransactionCategory({ category_id: 4, is_income: true, category_name: 'Tiền đầu tư', category_source: require('../../../../assets/images/invest.png') }),
    new TransactionCategory({ category_id: 5, is_income: true, category_name: 'Tiền khác', category_source: require('../../../../assets/images/other-money.png') }),
  ])

  React.useEffect(() => {
    const addElement = incomes.array.findIndex((item) => item.category_id === 1)
    if (addElement !== -1) { incomes.removeAt(addElement) }
    incomes.push(new TransactionCategory({ category_id: 1, category_name: '', category_source: require('../../../../assets/icons/plus-blue-2.png') }))
  }, [])

  const handleSelected = (selected: TransactionCategory) => {
    const condition = selected.category_id === idSelected || selected.category_id === 1 ? 0 : selected.category_id
    setIdSelected(condition)
    onItemPress(selected)
  }

  return (
    <View className='items-center justify-center flex-1 px-1 py-2'>
      <FlatList
        data={incomes.array}
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
                <Image className='w-[60] h-[60]' source={item.category_source} />
                {item.category_name !== '' && <Text className={`text-center ${idSelected === item.category_id ? 'text-pink-500' : 'text-gray-500'}`}>{item.category_name}</Text>}
              </View>
            </TouchableOpacity>
          )
        }}
      />
    </View>
  )
}

export default IncomeComponent