import React from "react"
import { View, Text, TouchableOpacity, SectionList, Image, ImageSourcePropType } from 'react-native'
import { Transaction, TransactionByMonth } from "../../../../models";
import { TRANSACTION_SOURCE } from "../../../../constants/Status";
import EmptyList from "../../../../components/EmptyList";
import { TEXT_STRING } from "../../../../constants/String";
import { getImageAsBase64 } from "../../../../utils/ImageUtils";
import { formatMoney } from "../../../../utils/NumberUtils";
import TransactionArrow from "../../../../assets/svgIcons/TransactionArrow";
import { formatDate } from "../../../../utils/TimeUtil";
import { getTransactionSourceText } from "../../../../utils/StringUtils";

interface Props {
    dataSections: TransactionByMonth[];
    onLongPress: (item: Transaction) => void;
}
const TransactionListSection = ({
    dataSections,
    onLongPress,
}: Props) => {

    return (
        <SectionList
            className='flex-grow'
            sections={dataSections}
            scrollEnabled={false}
            ListEmptyComponent={<EmptyList message={TEXT_STRING.NO_TRANSACTION} />}
            keyExtractor={(item) => item.transactionId.toString()}
            renderItem={({ item }) => {
                const isIncome = item.transactionType.isIncome ? '+' : '-'
                const colorText = item.source === TRANSACTION_SOURCE.CASH
                    ? 'text-green-500'
                    : item.source === TRANSACTION_SOURCE.BANK
                        ? 'text-[#0071BB]'
                        : 'text-[#A50064]'
                return (
                    <TouchableOpacity
                        className='flex flex-row items-center justify-between pb-3 space-x-2'
                        onLongPress={() => onLongPress(item)}
                    >
                        <Image
                            source={
                                item.transactionType.categorySource instanceof Object
                                    ? { uri: `data:image/png;base64,${getImageAsBase64(new Uint8Array(Object.values(item.transactionType.categorySource) as number[]).buffer)}` }
                                    : (
                                        typeof item.transactionType.categorySource === 'string'
                                            ? { uri: `data:image/png;base64,${item.transactionType.categorySource}` }
                                            : (item.transactionType.categorySource as ImageSourcePropType)
                                    )
                            }
                            className='flex-none w-12 h-12 bg-white rounded-full'
                        />
                        <View className='flex flex-row items-center justify-between flex-1 space-x-4'>
                            <View className='flex-1'>
                                <Text className='text-white'>{item.transactionType.categoryName}</Text>
                                <Text className='text-white'>{item.transactionNote}</Text>
                            </View>
                            <View className='flex-row items-center flex-none'>
                                <View className='items-end'>
                                    <Text className={`text-white ${colorText} font-bold`}>
                                        {isIncome + formatMoney(item.transactionAmount)} {TEXT_STRING.UNIT_SHOT}
                                    </Text>
                                    <Text className={`text-white ${colorText}`}>{getTransactionSourceText(item.source)}</Text>
                                </View>
                                <TransactionArrow type={item.transactionType.isIncome ? 'income' : 'expense'} />
                            </View>
                        </View>
                    </TouchableOpacity>
                )
            }}
            renderSectionHeader={({ section: { dateTime } }: { section: { dateTime: string } }) => {
                const { formattedDate, dayOfWeek } = formatDate(dateTime)
                return (
                    <View
                        className='flex flex-row justify-between p-2 my-2 bg-gray-700 border border-gray-600 rounded-md'
                    >
                        <Text className='text-white'>{formattedDate}</Text>
                        <Text className='text-white'>{dayOfWeek}</Text>
                    </View>
                )
            }}
        />
    )
}

export default TransactionListSection