import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { FilterModalProps } from './types';
import { Ionicons } from '@expo/vector-icons';
import { PickerItem } from '../../../commons/types';
import { DECENTRAVELLER_DEFAULT_CONTRAST_COLOR, interestsItemsApi } from '../../../commons/global';
import DecentravellerPicker from '../../../commons/components/DecentravellerPicker';
import { Picker } from '@react-native-picker/picker';
import { bottomTabIndicationTextStyles } from '../../../styles/bottomTabScreensStyles';

const Bullet = ({ label, selected, onPress }) => {
    return (
        <View style={styles.bulletOptionContainer}>
            <Ionicons
                name={selected ? 'md-checkmark-circle' : 'md-radio-button-off'}
                size={16}
                color={selected ? DECENTRAVELLER_DEFAULT_CONTRAST_COLOR : 'lightgray'}
            />
            <Text style={[styles.bulletOption, selected && styles.bulletOptionSelected]} onPress={onPress}>
                {label}
            </Text>
        </View>
    );
};

const FilterModal: React.FC<FilterModalProps> = ({ route }) => {
    const { filterModalData } = route.params;
    const { orderBy, setOrderBy, minStars, setMinStars, maxDistance, setMaxDistance, interest, setInterest } =
        filterModalData;

    const handleOrderByChange = (value) => {
        setOrderBy(value);
    };

    const handleMinStarsChange = (value) => {
        setMinStars(value);
    };

    const handleMaxDistanceChange = (value) => {
        setMaxDistance(value);
    };

    const interestOnValueChange = (interestValue, pos) => {
        setInterest(interestValue);
    };

    const orderByOnValueChange = (orderValue, pos) => {
        setOrderBy(orderValue);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Order by:</Text>
            <View style={styles.pickerContainer}>
                <Picker style={styles.picker} selectedValue={orderBy} onValueChange={orderByOnValueChange}>
                    <Picker.Item label="Relevancy" value={null} />
                    <Picker.Item label="Best rated" value="score" />
                    <Picker.Item label="Amount of reviews" value="reviews" />
                    <Picker.Item label="Distance" value="distance" />
                </Picker>
            </View>
            <Text style={styles.label}>Interest:</Text>
            <View style={styles.pickerContainer}>
                <Picker selectedValue={interest} onValueChange={interestOnValueChange}>
                    <Picker.Item label="Any" value={null} />
                    {interestsItemsApi.map((item) => {
                        return <Picker.Item key={item['value']} label={item['label']} value={item['value']} />;
                    })}
                </Picker>
            </View>
            <Text style={styles.label}>Min stars:</Text>
            <View style={styles.optionContainer}>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={5}
                    step={0.5}
                    value={minStars}
                    onValueChange={handleMinStarsChange}
                />
                <Text style={styles.sliderValue}>{minStars !== 0 ? minStars : 'No minimum stars'}</Text>
            </View>
            <Text style={styles.label}>Max distance:</Text>
            <View style={styles.optionContainer}>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={10}
                    step={0.1}
                    value={maxDistance}
                    onValueChange={handleMaxDistanceChange}
                />
                <Text style={styles.sliderValue}>
                    {maxDistance !== 0 ? maxDistance.toString() + 'km' : 'No maximum distance'}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingHorizontal: 30,
        paddingTop: 10,
    },
    pickerContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 10,
    },
    picker: {},
    optionContainer: {
        flex: 1,
        marginBottom: 10,
    },
    label: {
        paddingRight: 70,
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Montserrat_400Regular',
        marginBottom: 5,
    },
    bulletContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 20,
    },
    slider: {
        width: '100%',
    },
    sliderValue: {
        textAlign: 'center',
        marginTop: 5,
    },
    bulletOptionContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        textAlign: 'left',
    },
    bulletOption: {
        fontSize: 16,
        marginLeft: 10,
        marginBottom: 5,
    },
    bulletOptionSelected: {
        fontWeight: 'bold',
        fontSize: 16,
        color: DECENTRAVELLER_DEFAULT_CONTRAST_COLOR,
    },
});

export default FilterModal;
