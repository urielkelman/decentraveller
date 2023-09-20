import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import LoadingComponent from "../../../commons/components/DecentravellerLoading";
import {RouteProp, useNavigation} from "@react-navigation/native";
import {Rule, RuleScreenProps} from "./types";

type LoadRulesResponse = {
    total: number;
    rulesToShow: Rule[];
};

type RuleLoadFunction = (offset: number, limit: number) => Promise<LoadRulesResponse>;

type RulesListParams = {
    ruleList?: Rule[] | null | undefined;
    loadRules?: RuleLoadFunction | null | undefined;
    minified: boolean;
    horizontal: boolean;
};

type RuleListProps = {
    route: RouteProp<Record<string, RulesListParams>, string>;
};

const DecentravellerRulesList: React.FC<RuleListProps> = ({ route}) => {
    const { ruleList, minified, horizontal, loadRules } = route.params
    const navigation = useNavigation<RuleScreenProps>()
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
            const navigateToScreen = () => {
                switch (item.status) {
                    case 'PENDING_APPROVAL':
                        navigation.navigate('PendingApprovalRuleScreen', { rule: item });
                        break;
                    case 'APPROVED':
                        navigation.navigate('ApprovedScreen', { rule: item });
                        break;
                    case 'PENDING_DELETED':
                        navigation.navigate('PendingDeletedScreen', { rule: item });
                        break;
                    case 'DELETED':
                        navigation.navigate('DeletedScreen', { rule: item });
                        break;
                    default:
                        break;
                }
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
                    onPress={navigateToScreen} // Llamar a la función de navegación en onPress
                >
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.description}</Text>
                    <Text style={{ fontSize: 12, fontStyle: 'italic' }}>{item.status}</Text>
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
            />
        );
    };

    return loading && !hasRules() ? <LoadingComponent /> : rulesListComponent();
};

export default DecentravellerRulesList;
