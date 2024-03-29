import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import LoadingComponent from '../../../commons/components/DecentravellerLoading';
import { useNavigation } from '@react-navigation/native';
import { Rule, RuleListProps, RuleScreenProps } from './types';
import { DECENTRAVELLER_DEFAULT_BACKGROUND_COLOR } from '../../../commons/global';

const DecentravellerRulesList: React.FC<RuleListProps> = ({ route }) => {
    const { ruleList, minified, horizontal, loadRules, selectionCallback } = route.params;
    const navigation = useNavigation<RuleScreenProps>();
    const [loading, setLoading] = useState<boolean>(false);
    const [rules, setRules] = useState<Rule[]>([]);
    const [ruleCount, setRuleCount] = useState<number>(0);

    const hasRules = () => {
        return rules != null && rules.length > 0;
    };

    useEffect(() => {
        (async () => {
            setLoading(true);
            if (ruleList != undefined) {
                const total = ruleList.length;
                setRules(ruleList);
                setRuleCount(total);
            } else if (loadRules != undefined) {
                const { total, rulesToShow } = await loadRules(0, 5);
                setRules(rulesToShow);
                setRuleCount(total);
            }
            setLoading(false);
        })();
    }, []);

    const loadMore = async () => {
        if (hasRules() && ruleCount > rules.length) {
            setLoading(true);
            const { total, rulesToShow } = await loadRules((rules.length / 5) | 0, 5);
            rules.push.apply(rules, rulesToShow);
            setLoading(false);
        }
    };

    const footerComponent = () => {
        return (
            <View>
                {!hasRules() ? <Text>No rules found.</Text> : null}
                {hasRules() && ruleCount > rules.length ? <LoadingComponent /> : null}
            </View>
        );
    };

    const rulesListComponent = () => {
        const internalRenderRuleItem = ({ item }: { item: Rule }) => {
            const navigateToDetail = () => {
                navigation.navigate('RuleDetailScreen', {
                    ruleId: item.ruleId,
                    blockchainStatus: item.ruleSubStatus,
                    rule: item,
                });
            };
            const navigateToScreen = () => {
                selectionCallback != null ? selectionCallback(item.ruleId, item.ruleStatement) : navigateToDetail();
            };

            return (
                <TouchableOpacity
                    style={{
                        backgroundColor: 'white',
                        borderRadius: 10,
                        padding: 16,
                        marginVertical: 8,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 2,
                        elevation: 2,
                    }}
                    onPress={navigateToScreen}
                >
                    <Text style={{ fontSize: 18, fontFamily: 'Montserrat_700Bold' }}>{item.ruleStatement}</Text>
                    <Text style={{ fontSize: 12, fontFamily: 'Montserrat_400Regular' }}>{item.ruleStatus}</Text>
                </TouchableOpacity>
            );
        };

        return (
            <FlatList
                data={rules}
                renderItem={internalRenderRuleItem}
                horizontal={horizontal}
                keyExtractor={(item, index) => String(index)}
                ListFooterComponent={footerComponent}
                onEndReached={loadMore}
                onEndReachedThreshold={0.1}
                style={{ backgroundColor: DECENTRAVELLER_DEFAULT_BACKGROUND_COLOR, flex: 1 }}
            />
        );
    };

    return loading && !hasRules() ? <LoadingComponent /> : rulesListComponent();
};

export default DecentravellerRulesList;
