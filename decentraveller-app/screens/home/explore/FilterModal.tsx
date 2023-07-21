import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import {FilterModalProps} from "./types";
import { Ionicons } from '@expo/vector-icons';
import {PickerItem} from "../../../commons/types";
import {DECENTRAVELLER_DEFAULT_CONTRAST_COLOR, interestsItems} from "../../../commons/global";
import DecentravellerPicker from "../../../commons/components/DecentravellerPicker";

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

    const {filterModalData} = route.params
    const {orderBy, setOrderBy, minStars, setMinStars, maxDistance, setMaxDistance, interest, setInterest} = filterModalData

    const [interestPickerItems, setInterestPickerItems] = React.useState<PickerItem[]>(interestsItems);
    const [interestPickerOpen, setInterestPickerOpen] = React.useState<boolean>(false);

    const handleOrderByChange = (value) => {
        setOrderBy(value);
    };

    const handleMinStarsChange = (value) => {
        setMinStars(value);
    };

    const handleMaxDistanceChange = (value) => {
        setMaxDistance(value);
    };

    return (
        <View style={styles.container}>
            <View style={styles.optionContainer}>
                <Text style={styles.label}>Order by:</Text>
                <View style={styles.bulletContainer}>
                    <Bullet
                        label="Best rated"
                        selected={orderBy === 'Best rated'}
                        onPress={() => handleOrderByChange('Best rated')}
                    />
                    <Bullet
                        label="Amount of comments"
                        selected={orderBy === 'Amount of comments'}
                        onPress={() => handleOrderByChange('Amount of comments')}
                    />
                    <Bullet
                        label="Distance"
                        selected={orderBy === 'Distance'}
                        onPress={() => handleOrderByChange('Distance')}
                    />
                </View>
            </View>
            <Text style={styles.label}>Interest</Text>
            <DecentravellerPicker
                titleText={''}
                dropdownPlaceholder={"Select Interest"}
                items={interestPickerItems}
                setItems={setInterestPickerItems}
                value={interest}
                setValue={setInterest}
                open={interestPickerOpen}
                setOpen={setInterestPickerOpen}
                onOpen={() => {}}
                searchable={true}
                zIndex={1000}
                zIndexInverse={3000}
            />
            <View style={styles.optionContainer}>
                <Text style={styles.label}>Min stars:</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={5}
                    step={1}
                    value={minStars}
                    onValueChange={handleMinStarsChange}
                />
                <Text style={styles.sliderValue}>{minStars !== 0 ? minStars: 'Not apply'}</Text>
            </View>
            <View style={styles.optionContainer}>
                <Text style={styles.label}>Max distance:</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={10}
                    step={0.5}
                    value={maxDistance}
                    onValueChange={handleMaxDistanceChange}
                />
                <Text style={styles.sliderValue}>{maxDistance !== 0 ? maxDistance.toString() + 'km': 'Not apply'}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 50,
        paddingTop: 10,
    },
    optionContainer: {
        paddingHorizontal: 10,
    },
    label: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Montserrat_400Regular',
    },
    bulletContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
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
        textAlign: 'left'
    },
    bulletOption: {
        fontSize: 16,
        marginLeft: 10,
        marginBottom: 5,

    },
    bulletOptionSelected: {
        fontWeight: 'bold',
        fontSize: 16,
        color: DECENTRAVELLER_DEFAULT_CONTRAST_COLOR
    },
});

export default FilterModal;
