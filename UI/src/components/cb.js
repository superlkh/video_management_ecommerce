import axios from 'axios'
import { useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import CIcon from '@coreui/icons-react'

const CB = () => {
    function useQueryParams() {
        const params = new URLSearchParams(
            window ? window.location.search : {}
        );

        return new Proxy(params, {
            get(target, prop) {
                return target.get(prop)
            },
        });
    }
    const { code } = useQueryParams()
    const history = useHistory()
    useEffect(async () => {
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:5000/connect/google/decodeToken',
            data: {
                code
            },
            headers: {
                'x-access-token': localStorage.getItem('X-Auth-Token')
            }
        })
        if (res.data.status === 'OK') {
            history.push('/')
        }
    }, [])

    return (
        <div>
            {/* <CIcon size="xl" name="cilReload" /><span className="mfs-2"></span> */}
        </div>
    )
}

export default CB