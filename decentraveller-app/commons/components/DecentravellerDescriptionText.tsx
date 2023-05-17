import { Text, View } from 'react-native';
import { addPlaceDescriptionTextStyles } from '../../styles/addPlaceScreensStyles';
import { addPlaceScreenWordings } from '../../screens/home/place/wording';

const DecentravellerDescriptionText = () => (
    <View>
        <Text style={addPlaceDescriptionTextStyles.text}>{addPlaceScreenWordings.CREATE_PLACE_DESC}</Text>
    </View>
);

export default DecentravellerDescriptionText;
