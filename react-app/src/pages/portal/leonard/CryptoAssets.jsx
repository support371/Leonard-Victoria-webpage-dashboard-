import { Bitcoin } from 'lucide-react';
import HoldingsPage from './HoldingsPage';

export default function CryptoAssets() {
  return <HoldingsPage category="crypto_asset" title="Crypto Assets" icon={Bitcoin} />;
}
