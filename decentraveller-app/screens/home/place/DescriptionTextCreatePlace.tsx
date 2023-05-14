import { Text, View } from 'react-native';
import { registrationDescriptionTextStyles } from '../../../styles/registrationScreensStyles';
import { addPlaceScreenWordings } from './wording';

const DescriptionTextCreatePlace = () => (
    <View>
        <Text style={registrationDescriptionTextStyles.text}>{addPlaceScreenWordings.CREATE_PLACE_DESC}</Text>
    </View>
);

export default DescriptionTextCreatePlace;
