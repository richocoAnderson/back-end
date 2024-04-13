const { doc, setDoc, collection, query, where, getDocs, getDoc, orWhere } = require('firebase/firestore');
const { firestore, KrsCollection, MahasiswaCollection, MatkulCollection } = require('../config'); 


function hitungRata(totalNilaiIp, jumlahSKS){
    const ipk = totalNilaiIp/jumlahSKS;
    return ipk
}

class KRS{
    static async createKRS({ kodeMk, semesterKRS, nim, nilai, sks }) {
        try {
          const matCollection = collection(firestore, KrsCollection);
          const q = query(matCollection, where('kodeMk', '==', kodeMk), where('semesterKRS', '==', semesterKRS), where('nim', '==', nim) );
          const querySnapshot = await getDocs(q);
          let bobot;

            if (nilai >= 80 && nilai <= 100) {
              bobot = "A";
          } else if (nilai >= 75 && nilai <= 79) {
              bobot = "B+";
          } else if (nilai >= 70 && nilai <= 74) {
              bobot = "B";
          } else if (nilai >= 65 && nilai <= 69) {
              bobot = "C+";
          } else if (nilai >= 60 && nilai <= 64) {
              bobot = "C";
          } else if (nilai >= 55 && nilai <= 59) {
              bobot = "D+";
          } else if (nilai >= 50 && nilai <= 54) {
              bobot = "D";
          } else if (nilai >= 45 && nilai <= 49) {
              bobot = "E+";
          } else if (nilai >= 40 && nilai <= 44) {
              bobot = "E";
          } else if (nilai >= 0 && nilai <= 39) {
              bobot = "F";
          } else {
              bobot = "Nilai tidak valid";
          }

          if (!querySnapshot.empty) {
            return { error: 'Data mata kuliah pada krs Sudah Ada' };
          } else {
            const idKrs = `KRS-${Math.floor(10000 + Math.random() * 90000)}`;
            const newMahasiswaRef = doc(matCollection);
            await setDoc(newMahasiswaRef, {
                idKrs, kodeMk, semesterKRS, nim, nilai, sks, bobot
            });
            return { message: 'Mata kuliah Ditambahkan' };
          }
        } catch (error) {
          console.error('Gagal menambahkan mata kuliah:', error.message);
          return { error: 'Gagal menambahkan mata kuliah', errorMessage: error };
        }
      }

      static async getAllIPK() {
        try {
            const mahasiswaCollection = collection(firestore, MahasiswaCollection);
            const mahasiswaSnapshot = await getDocs(mahasiswaCollection);
            let hasilIPK = [];
    
            // Iterasi melalui setiap mahasiswa dengan for...of loop
            for (const mahasiswaDoc of mahasiswaSnapshot.docs) {
                const nim = mahasiswaDoc.data().nim;
                const nama = mahasiswaDoc.data().nama;
    
                let totalNilai = 0;
                let totalSKS = 0;
                let nilai = 0;
    
                // Ambil KRS mahasiswa dari database
                const krsCollection = collection(firestore, KrsCollection);
                const krsQuery = query(krsCollection, where('nim', '==', nim));
                const krsSnapshot = await getDocs(krsQuery);
    
                // Iterasi melalui setiap KRS mahasiswa
                krsSnapshot.forEach((krsDoc) => {
                    const bobotNilai = krsDoc.data().bobot;
                    const sks = krsDoc.data().sks;
    
                    if (bobotNilai === "A") {
                        nilai = 4.00;
                    } else if (bobotNilai === "B+") {
                        nilai = 3.50;
                    } else if (bobotNilai === "B") {
                        nilai = 3.00;
                    } else if (bobotNilai === "C+") {
                        nilai = 2.50;
                    } else if (bobotNilai === "C") {
                        nilai = 2.00;
                    } else if (bobotNilai === "D+") {
                        nilai = 1.50;
                    } else if (bobotNilai === "D") {
                        nilai = 1.00;
                    } else if (bobotNilai === "E") {
                        nilai = 0.00;
                    }
                    // Hitung total nilai dan total SKS
                    totalNilai += nilai * sks;
                    totalSKS += sks;
                });
    
                // Hitung IPK untuk mahasiswa
                const ipk = totalSKS > 0 ? totalNilai / totalSKS : 0;
    
                // Tambahkan data IPK ke dalam array hasilIPK
                hasilIPK.push({ nama: nama, ipk: ipk });
    
            }
    
            return hasilIPK;
        } catch (error) {
            console.error('Gagal menghitung IPK:', error.message);
            throw error;
        }
    }
    

    static async getIPKByNIM(nim) {
      try {
          const mahasiswaCollection = collection(firestore, MahasiswaCollection);
          const mahasiswaQuery = query(mahasiswaCollection, where('nim', '==', nim));
          const mahasiswaSnapshot = await getDocs(mahasiswaQuery);
  
          if (mahasiswaSnapshot.empty) {
              throw new Error('Mahasiswa dengan NIM tersebut tidak ditemukan');
          }
  
          let hasilIPK = [];
  
          // Ambil data mahasiswa dari snapshot
          const mahasiswaDoc = mahasiswaSnapshot.docs[0];
          const nama = mahasiswaDoc.data().nama;
  
          let totalNilai = 0;
          let totalSKS = 0;
          let nilai = 0;
  
          // Ambil KRS mahasiswa dari database berdasarkan NIM
          const krsCollection = collection(firestore, KrsCollection);
          const krsQuery = query(krsCollection, where('nim', '==', nim));
          const krsSnapshot = await getDocs(krsQuery);

          if (krsSnapshot.empty) {
            throw new Error('Mahasiswa belum melakukan KRS');
        }
  
          // Iterasi melalui setiap KRS mahasiswa
          krsSnapshot.forEach((krsDoc) => {
              const bobotNilai = krsDoc.data().bobot;
              const sks = krsDoc.data().sks;
  
              if (bobotNilai === "A") {
                  nilai = 4.00;
              } else if (bobotNilai === "B+") {
                  nilai = 3.50;
              } else if (bobotNilai === "B") {
                  nilai = 3.00;
              } else if (bobotNilai === "C+") {
                  nilai = 2.50;
              } else if (bobotNilai === "C") {
                  nilai = 2.00;
              } else if (bobotNilai === "D+") {
                  nilai = 1.50;
              } else if (bobotNilai === "D") {
                  nilai = 1.00;
              } else if (bobotNilai === "E") {
                  nilai = 0.00;
              }
              // Hitung total nilai dan total SKS
              totalNilai += nilai * sks;
              totalSKS += sks;
          });
  
          // Hitung IPK untuk mahasiswa
          const ipk = totalSKS > 0 ? totalNilai / totalSKS : 0;
  
          // Tambahkan data IPK ke dalam array hasilIPK
          hasilIPK.push({ nama: nama, ipk: ipk });
  
          return { hasilIPK };
      } catch (error) {
          console.error('Gagal menghitung IPK:', error.message);
          throw error;
      }
  }
  
  
  
  
  
    
}


module.exports = KRS;