import { StyleSheet, Dimensions } from "react-native";

const { height } = Dimensions.get("window");

const GlobalStyles = StyleSheet.create({
    primaryBtnWrapper:{
        flexDirection: 'row',
        alignItems: "center", 
        justifyContent: "center", 
    },
    primaryBtnActive:{
        width: '100%',
        paddingHorizontal: 8,
        backgroundColor: '#ffffff',
        borderRadius: 50,
    },
    primaryBtnEnabled:{
        borderWidth: 1,
        borderColor: '#FF00A1',
    },
    primaryBtnDisabled: {
        backgroundColor: '#E9E9E9',
    },
    primaryBtnPressed:{
        borderWidth: 1,
        backgroundColor: '#E60091',
        borderColor: '#FFFFFF',
    },
    primaryBtnText:{
        fontFamily: "GmarketSansMedium",
        fontSize: 16,
        lineHeight: 16,
        paddingHorizontal:20,
        paddingVertical:16,
        color: '#FF00A1',
        textAlign: 'center',
    },
    primaryBtnTextEnabled:{
        color: '#FF00A1',
    },
    primaryBtnTextDisabled:{
        color: '#848484',
    },
    primaryBtnTextPressed:{
        color: '#ffffff',
    },
    appText1: {
        fontFamily: "HakgyoansimBold600",
        fontSize: height * 0.035,
        textAlign: 'center',
        marginBottom: 40,
    },
    appText2: {
        fontFamily: "HakgyoansimBold600",
        fontSize: height * 0.075,
        textTransform: "uppercase",
        textAlign: 'center',
    },
  });
  
  export default GlobalStyles;