import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import {FilterModalProps} from "./types";

const FilterModal: React.FC<FilterModalProps> = ({ route }) => {
    const {filterModalData} = route.params
    const {orderBy, setOrderBy, minStars, setMinStars, maxDistance, setMaxDistance} = filterModalData

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
                    <BulletOption
                        label="Best rated"
                        selected={orderBy === 'Best rated'}
                        onPress={() => handleOrderByChange('Best rated')}
                    />
                    <BulletOption
                        label="Amount of comments"
                        selected={orderBy === 'Amount of comments'}
                        onPress={() => handleOrderByChange('Amount of comments')}
                    />
                    <BulletOption
                        label="Distance"
                        selected={orderBy === 'Distance'}
                        onPress={() => handleOrderByChange('Distance')}
                    />
                </View>
            </View>
            <View style={styles.optionContainer}>
                <Text style={styles.label}>Min stars:</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={1}
                    maximumValue={5}
                    step={1}
                    value={minStars}
                    onValueChange={handleMinStarsChange}
                />
                <Text style={styles.sliderValue}>{minStars}</Text>
            </View>
            <View style={styles.optionContainer}>
                <Text style={styles.label}>Max distance:</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0.1}
                    maximumValue={10}
                    step={0.1}
                    value={maxDistance}
                    onValueChange={handleMaxDistanceChange}
                />
                <Text style={styles.sliderValue}>{maxDistance}km</Text>
            </View>
        </View>
    );
};

const BulletOption = ({ label, selected, onPress }) => {
    return (
        <Text
            style={[styles.bulletOption, selected && styles.bulletOptionSelected]}
            onPress={onPress}
        >
            {label}
        </Text>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    optionContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    bulletContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bulletOption: {
        fontSize: 14,
        marginBottom: 5,
    },
    bulletOptionSelected: {
        fontWeight: 'bold',
    },
    slider: {
        width: '100%',
    },
    sliderValue: {
        textAlign: 'center',
        marginTop: 5,
    },
});

export default FilterModal;
