import React, {useState} from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Pressable,
  ToastAndroid,
} from 'react-native';
import {connect, shallowEqual, useSelector} from 'react-redux';
import {EyeClose, EyeOpen, Tick} from '../../assets/Icons';
import {theme} from '../../constants';
import {regularExp} from '../../Utils/regExp';
import {SignIn} from '../../redux/Modules/auth/action.auth';
import {
  Authorization,
  isLoadingSelector,
  errorSelector,
} from '../../redux/Modules/auth/selector.auth';
import styles from './Styles';

const Login = ({navigation, SignInFunc}) => {

  const Loader = useSelector(isLoadingSelector, shallowEqual);
  const error = useSelector(errorSelector, shallowEqual);
  const [Email, setEmail] = useState({
    useremail: '',
    checkEmailInputChange: false,
  });
  const [Passward, setPassward] = useState({
    Password: '',
    secureTextEntry: true,
  });

  const validateEmail = email => {
    const re = regularExp.email;
    re.test(email) === true
      ? setEmail({...Email, useremail: email, checkEmailInputChange: true})
      : setEmail({...Email, useremail: email, checkEmailInputChange: false});
  };
  function HandlePasswordChange(PasswordVal) {
    setPassward({...Passward, Password: PasswordVal});
  }
  const updateSecuretextEntry = () => {
    setPassward({...Passward, secureTextEntry: !Passward.secureTextEntry});
  };
  const secureIt = Passward.secureTextEntry ? true : false;
  async function Login() {
    if (Email.checkEmailInputChange && Passward.Password.length >= 6) {
      const data = {
        email: Email.useremail,
        password: Passward.Password,
      };
      SignInFunc(data);
    } else {
      ToastAndroid.showWithGravity('Invalid Fields', 1000, 50);
    }
  }

  React.useEffect(() => {
  
    if (!Loader.isLoading && error.data.name==='UserNotConfirmedException') {
      navigation.navigate('ConfirmUser', {
        Email: Email.useremail,
      });
    }
  }, [error.data, Loader.isLoading]);

  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: theme.colors.Blue,
          width: 70,
          height: 70,
          position: 'absolute',
          borderRadius: 40,
          opacity: 0.5,
          left: -20,
          top: -15,
        }}
      />
      <View
        style={{
          backgroundColor: theme.colors.Red,
          width: 70,
          height: 70,
          position: 'absolute',
          borderRadius: 40,
          opacity: 0.5,
          right: -20,
          bottom: -15,
        }}
      />
      <View style={styles.InnerContainer}>
        <View>
          <Text style={styles.headerText}>Get back to Reading</Text>
        </View>
        <View style={{flexWrap: 'nowrap', marginTop: 5}}>
          <Text style={styles.subHeaderText}>Detox your Mind😉</Text>
        </View>
      </View>
      <View style={styles.inputOuterContainer}>
        <TextInput
          placeholder="Enter your Email"
          placeholderTextColor={theme.colors.MediumGray}
          style={styles.inputInnerContainer}
          value={Email.useremail}
          onChangeText={res => validateEmail(res)}
        />
        {Email.checkEmailInputChange ? <Tick /> : null}
      </View>
      <View style={styles.inputOuterContainer}>
        <TextInput
          placeholder="Enter your Password"
          placeholderTextColor={theme.colors.MediumGray}
          style={styles.inputInnerContainer}
          secureTextEntry={secureIt}
          value={Passward.Password}
          onChangeText={res => HandlePasswordChange(res)}
        />
        <TouchableOpacity
          onPress={() => updateSecuretextEntry()}
          style={{zIndex: 10}}>
          {Passward.secureTextEntry === true ? <EyeOpen /> : <EyeClose />}
        </TouchableOpacity>
      </View>
      <View
        style={{
          width: theme.constants.screenWidth - 80,
          marginTop:16,
          marginBottom: 48,
        }}>
        <TouchableOpacity>
          <Text style={styles.semiText}>Forgot your Password?</Text>
        </TouchableOpacity>
      </View>

      <Pressable
        android_ripple={{
          color: theme.colors.LightGray,
          borderless: false,
          radius: 200,
        }}
        onPress={() => Login()}>
        <View style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Let's Get you Back</Text>
        </View>
      </Pressable>
      <View style={styles.hintTextContainer}>
        <Text style={styles.hintText}>Are You new to this?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.hintTextAction}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    // dispatching plain actions
    SignInFunc: event => dispatch(SignIn(event)),
  };
};

export default connect(null, mapDispatchToProps)(Login);
