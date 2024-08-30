import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode
import { Picker } from '@react-native-picker/picker';

// Function to get the email from token
const getEmail = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Token not found!');
    const decodedToken = jwtDecode(token);
    return decodedToken.email;
  } catch (error) {
    console.error('Error fetching email:', error);
    return null;
  }
};

const MurojatAdd = () => {
  const [fish, setFish] = useState('');
  const [idpass, setIdpass] = useState('');
  const [selectedYashashmanzili, setSelectedYashashmanzili] = useState('');
  const [selectedMFY, setSelectedMFY] = useState('');
  const [kochanomi, setKochanomi] = useState('');
  const [telefonraqam, setTelefonraqam] = useState('');
  const [rasmvavidio, setRasmvavidio] = useState('');
  const [arizaTurlari, setArizaTurlari] = useState([
        { code: 'sud_mas', labelLotin: 'Sud masalalari', labelKril: 'Суд масалалари' },
        { code: 'ichki_ishlar', labelLotin: 'Ichki ishlar faoliyati', labelKril: 'Ички ишлар фаолияти' },
        { code: 'prokuratura', labelLotin: 'Prokuratura faoliyati', labelKril: 'Прокуратура фаолияти' },
        { code: 'aliment', labelLotin: 'Aliment masalasi', labelKril: 'Алимент масаласи' },
        { code: 'sud_ijrosi', labelLotin: 'Sud ijrosi', labelKril: 'Суд ижроси' },
        { code: 'sogliq', labelLotin: 'Sogʻliqni saqlash', labelKril: 'Соғлиқни сақлаш' },
        { code: 'pensiya', labelLotin: 'Pensiya va nafaqa', labelKril: 'Пенсия ва нафақа' },
        { code: 'maktab', labelLotin: 'Maktab taʼlimi', labelKril: 'Мактаб таълими' },
        { code: 'uy_joy', labelLotin: 'Uy-joy, yer bilan taʼm', labelKril: 'Ўй-жой, ер билан таъм' },
        { code: 'ish', labelLotin: 'Ish bilan taʼminlash', labelKril: 'Иш билан таъминлаш' },
        { code: 'afv', labelLotin: 'Afv etish masalasi', labelKril: 'Афв этиш масаласи' },
        { code: 'oliy_talim', labelLotin: 'Oliy taʼlim masalalari', labelKril: 'Олий таълим масалалари' },
        { code: 'kredit', labelLotin: 'Kredit olish', labelKril: 'Кредит олиш' },
        { code: 'bank', labelLotin: 'Bank-moliya masalalari', labelKril: 'Банк-молия масалалари' },
        { code: 'kommunal', labelLotin: 'Gaz, elektr, suv, issiqlik taʼminoti', labelKril: 'Газ, электр, сув, иссиқлик таъминоти' },
        { code: 'kommunal_to\'lov', labelLotin: 'Kommunal toʻlovlarni hisoblash', labelKril: 'Коммунал тўловларни ҳисоблаш' },
        { code: 'yol_qurilishi', labelLotin: 'Yoʻl qurilishi', labelKril: 'Йўл қурилиши' },
        { code: 'soliq', labelLotin: 'Soliq toʻlovlari', labelKril: 'Солиқ тўловлари' },
        { code: 'transport', labelLotin: 'Transport masalalari', labelKril: 'Транспорт масалалари' },
        { code: 'qurilish', labelLotin: 'Qurilish sohasidagi masalalar', labelKril: 'Қурилиш соҳасидаги масалалар' },
        { code: 'tadbirkorlik', labelLotin: 'Tadbirkorlik huquqlarini buzilishi', labelKril: 'Тадбиркорлик ҳуқуқларини бузилиши' },
        { code: 'sanat', labelLotin: 'Sanʼat, maʼrifat va madaniyat masalalari', labelKril: 'Санʼат, маърифат ва маданият масалалари' },
        { code: 'dori', labelLotin: 'Dori-darmon narx-navolari', labelKril: 'Дори-дармон нарх-наволари' },
        { code: 'birinchi_ehtiyoj', labelLotin: 'Birinchi ehtiyoj mollari narx-navolari', labelKril: 'Биринчи эҳтиёж моллари нарх-наволари' },
        { code: 'davlat_xizmati', labelLotin: 'Davlat xizmati faoliyati', labelKril: 'Давлат хизмати фаолияти' },
        { code: 'moddiy_yordam', labelLotin: 'Moddiy yordam olish', labelKril: 'Моддий ёрдам олиш' },
        { code: 'boshqa', labelLotin: 'Boshqa masalalar', labelKril: 'Бошқа масалалар' }
  ]);
  const [selectedArizaTuri, setSelectedArizaTuri] = useState('');
  const [matn, setMatn] = useState('');
  const [email, setEmail] = useState(null);
  const [yashashManzililar, setYashashManzililar] = useState([]);
  const [filteredMFYs, setFilteredMFYs] = useState([]);
  const [loading, setLoading] = useState(false); // State for loading

  useEffect(() => {
    const fetchEmail = async () => {
      const emailFromStorage = await getEmail();
      setEmail(emailFromStorage);
    };
    fetchEmail();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const yashashResponse = await fetch('https://sirdaryoapi.pythonanywhere.com/api/mfy/');
        const yashashData = await yashashResponse.json();

        const yashashManzililar = [...new Set(yashashData.map(item => item.Yashashmazili))];
        const localMfy = yashashData.reduce((acc, item) => {
          if (!acc[item.Yashashmazili]) {
            acc[item.Yashashmazili] = [];
          }
          acc[item.Yashashmazili].push(item.Mfy);
          return acc;
        }, {});

        setYashashManzililar(yashashManzililar);
        setFilteredMFYs(localMfy[selectedYashashmanzili] || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedYashashmanzili]);

  const submitForm = async () => {
    if (!email) {
      Alert.alert('Error', 'Email is not available!');
      return;
    }

    const arizaTuriKril = arizaTurlari.find(turi => turi.code === selectedArizaTuri)?.labelKril;

    setLoading(true); // Set loading to true when the request starts
    try {
      const response = await fetch('https://sirdarya777.pythonanywhere.com/api/', {
        method: 'POST',
        body: JSON.stringify({
          fish,
          idpassport: idpass,
          Yashashmanzili: selectedYashashmanzili,
          mfynomi: selectedMFY,
          kochanomi,
          telefonraqami: telefonraqam,
          rasmvavidio,
          ariza_mazmuni: arizaTuriKril,
          matn,
          user: email,
        }),
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`,
        }
      });

      if (response.status === 201) {
        Alert.alert('Success', 'Ariza muvaffaqiyatli yuborildi!');
        // Navigate to another screen or reset form
      } else {
        Alert.alert('Error', 'Ariza yuborishda xato yuz berdi.');
      }
    } catch (error) {
      Alert.alert('Network Error', error.message);
    } finally {
      setLoading(false); // Set loading to false after the request completes
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" /> // Show loader if loading
      ) : (
        <>
          <Text style={styles.label}>F.I.SH</Text>
          <TextInput
            style={styles.input}
            value={fish}
            onChangeText={setFish}
            placeholder="F.I.SH"
          />

          <Text style={styles.label}>ID Passport</Text>
          <TextInput
            style={styles.input}
            value={idpass}
            onChangeText={setIdpass}
            placeholder="ID Passport"
          />

          <Text style={styles.label}>Yashash Manzili</Text>
          <Picker
            selectedValue={selectedYashashmanzili}
            onValueChange={(itemValue) => {
              setSelectedYashashmanzili(itemValue);
              setFilteredMFYs(yashashManzililar[itemValue] || []);
              setSelectedMFY(''); // Reset MFY selection
            }}
            style={styles.picker}
          >
            {yashashManzililar.map((item, index) => (
              <Picker.Item key={index} label={item} value={item} />
            ))}
          </Picker>

          <Text style={styles.label}>MFY</Text>
          <Picker
            selectedValue={selectedMFY}
            onValueChange={(itemValue) => setSelectedMFY(itemValue)}
            style={styles.picker}
          >
            {filteredMFYs.map((item, index) => (
              <Picker.Item key={index} label={item} value={item} />
            ))}
          </Picker>

          <Text style={styles.label}>Kochanomi</Text>
          <TextInput
            style={styles.input}
            value={kochanomi}
            onChangeText={setKochanomi}
            placeholder="Kochanomi"
          />

          <Text style={styles.label}>Telefon Raqam</Text>
          <TextInput
            style={styles.input}
            value={telefonraqam}
            onChangeText={setTelefonraqam}
            placeholder="Telefon Raqam"
          />

          <Text style={styles.label}>Rasm va Video</Text>
          <TextInput
            style={styles.input}
            value={rasmvavidio}
            onChangeText={setRasmvavidio}
            placeholder="Rasm va Video"
          />

          <Text style={styles.label}>Ariza Mazmuni</Text>
          <Picker
            selectedValue={selectedArizaTuri}
            onValueChange={(itemValue) => setSelectedArizaTuri(itemValue)}
            style={styles.picker}
          >
            {arizaTurlari.map((item) => (
              <Picker.Item key={item.code} label={`${item.labelLotin} (${item.labelKril})`} value={item.code} />
            ))}
          </Picker>

          <Text style={styles.label}>Matn</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={matn}
            onChangeText={setMatn}
            placeholder="Matn"
            multiline
          />

          <Button title="Yuborish" onPress={submitForm} color="#007BFF" />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 20,
      backgroundColor: '#E8F0F2',
    },
    label: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 10,
      color: '#333',
    },
    input: {
      height: 45,
      borderColor: '#B0BEC5',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      backgroundColor: '#FFF',
      marginBottom: 18,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 1,
    },
    picker: {
      height: 50,
      borderColor: '#B0BEC5',
      borderWidth: 1,
      borderRadius: 8,
      backgroundColor: '#FFF',
      marginBottom: 18,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 1,
    },
    textArea: {
      height: 120,
      textAlignVertical: 'top',
      paddingVertical: 10,
    },
  });
  

export default MurojatAdd;
