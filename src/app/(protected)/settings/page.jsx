
import { auth } from '../../../../auth'

const SettingsPage = async ()=>{
    const session = await auth();
    return (
        <div>
            Settings Page
            {JSON.stringify(session)}
        </div>
    )
}

export default SettingsPage;