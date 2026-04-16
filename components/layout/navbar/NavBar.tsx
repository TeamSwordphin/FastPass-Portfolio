import NavBarClient from './NavBarClient';
import { getActiveSiteEvent } from '@/lib/server/site-events';

export default async function NavBar() {
	const activeEvent = await getActiveSiteEvent();
	return <NavBarClient activeEvent={activeEvent} />;
}
