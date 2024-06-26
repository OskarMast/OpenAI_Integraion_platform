import { ActionIcon } from '@lobehub/ui';
import { MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { GlobalStore } from '@/store/global';
import { SidebarTabKey } from '@/store/global/initialState';

export interface TopActionProps {
  tab?: GlobalStore['sidebarKey'];
}

const TopActions = memo<TopActionProps>(({ tab }) => {
  const { t } = useTranslation('common');
  const pathname = usePathname();
  return (
    <>
      <Link aria-label={t('tab.chat')} href={pathname === '/userchat' ? '/userchat' : '/chat'}>
        <ActionIcon
          active={tab === SidebarTabKey.Chat}
          icon={MessageSquare}
          placement={'right'}
          size="large"
          title={t('tab.chat')}
        />
      </Link>
      {/* <Link aria-label={t('tab.market')} href={'/market'}>
        <ActionIcon
          active={tab === SidebarTabKey.Market}
          icon={Compass}
          placement={'right'}
          size="large"
          title={t('tab.market')}
        />
      </Link> */}
    </>
  );
});

export default TopActions;
