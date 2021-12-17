
import  axios, {AxiosInstance} from 'axios'

export class AuthService{
    private api:AxiosInstance
    
    constructor(){
        this.api =  axios.create({
            baseURL: process.env.AUTH_SERVICE_URL,
            headers:{
                'Device-Id': process.env.AUTH_SERVICE_DEVICE_ID,
                'Accept-Language': process.env.AUTH_SERVICE_ACCEPT_LANGUAGE,
                'Authorization': 'Baerer '+process.env.AUTH_SERVICE_TOKEN,
                'Platform-Version': process.env.AUTH_SERVICE_PLATFORM_VERSION,
            }
        })
    }

    public async checkToken(
        token: string,
        publickey: string,
        deviceId: string,
        acceptLanguage: string,
        platformVersion: string
    ){
        return new Promise((resolve, reject)=>{
            this.api.post('/authorization/check-token', {
                token,
                publickey,
                device_id: deviceId
            }, {
                headers: {
                    'Accept-Language': acceptLanguage,
                    'Platform-Version': platformVersion,
                }
            })
            .then((result) => {
                resolve(result)
            }).catch((err) => {
                reject(err)
            });
        })
    }

}