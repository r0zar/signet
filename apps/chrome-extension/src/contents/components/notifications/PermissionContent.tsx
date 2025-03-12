import React from 'react';
import { PermissionContentProps, DefaultPermissionContentProps, PermissionLevel, BannerType } from './types';
import { PermissionLevelIndicator, OriginBanner, FeatureExplanation, OperationTypeDisplay } from './UIComponents';
import { PermissionIcons } from './Icons';
import { commonStyles } from './styles';

/**
 * ExtensionCheck permission content
 */
export const ExtensionCheckContent: React.FC<PermissionContentProps> = ({ origin, rememberCheckbox }) => (
  <div style={commonStyles.contentContainer}>
    <PermissionLevelIndicator level={PermissionLevel.INFO} />

    <OriginBanner
      origin={origin}
      type={BannerType.INFO}
      message="wants to detect Signet"
    />

    <div style={commonStyles.explanationContainer}>
      <FeatureExplanation
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20M4 12H14M4 18H10" stroke="#36C758" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
        text="Check if Signet extension is installed"
      />

      <FeatureExplanation
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#36C758" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 17L12 22L22 17" stroke="#36C758" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12L12 17L22 12" stroke="#36C758" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
        text="Retrieve extension version information"
      />
    </div>

    {rememberCheckbox}
  </div>
);

/**
 * GetStatus permission content
 */
export const GetStatusContent: React.FC<PermissionContentProps> = ({ origin, rememberCheckbox }) => (
  <div style={commonStyles.contentContainer}>
    <PermissionLevelIndicator level={PermissionLevel.INFO} />

    <OriginBanner
      origin={origin}
      type={BannerType.INFO}
      message="wants to read Signet status"
    />

    <div style={commonStyles.explanationContainer}>
      <FeatureExplanation
        icon={PermissionIcons.status}
        text="View connection status"
      />

      <FeatureExplanation
        icon={PermissionIcons.subnet}
        text="See available subnets"
      />

      <FeatureExplanation
        icon={PermissionIcons.wallet}
        text="Access wallet address"
      />
    </div>

    {rememberCheckbox}
  </div>
);

/**
 * Balance permission content
 */
export const BalanceContent: React.FC<PermissionContentProps> = ({ origin, rememberCheckbox }) => (
  <div style={commonStyles.contentContainer}>
    <PermissionLevelIndicator level={PermissionLevel.SENSITIVE} />

    <OriginBanner
      origin={origin}
      type={BannerType.WARNING}
      message="wants to access your account balance"
    />

    <div style={commonStyles.explanationContainer}>
      <FeatureExplanation
        icon={PermissionIcons.balance}
        text="View your balance on a specific subnet"
      />

      <FeatureExplanation
        icon={PermissionIcons.wallet}
        text="Access wallet address"
      />
    </div>

    {rememberCheckbox}
  </div>
);

/**
 * Balances permission content
 */
export const BalancesContent: React.FC<PermissionContentProps> = ({ origin, rememberCheckbox }) => (
  <div style={commonStyles.contentContainer}>
    <PermissionLevelIndicator level={PermissionLevel.SENSITIVE} />

    <OriginBanner
      origin={origin}
      type={BannerType.WARNING}
      message="wants to access all your account balances"
    />

    <div style={commonStyles.explanationContainer}>
      <FeatureExplanation
        icon={PermissionIcons.balance}
        text="View your balances across all subnets"
      />

      <FeatureExplanation
        icon={PermissionIcons.subnet}
        text="Access information about all your subnets"
      />
    </div>

    {rememberCheckbox}
  </div>
);

/**
 * Transfer permission content
 */
export const TransferContent: React.FC<PermissionContentProps> = ({ origin, rememberCheckbox }) => (
  <div style={commonStyles.contentContainer}>
    <PermissionLevelIndicator level={PermissionLevel.CRITICAL} />

    <OriginBanner
      origin={origin}
      type={BannerType.CRITICAL}
      message="wants to create a transfer transaction"
    />

    <div style={commonStyles.explanationContainer}>
      <FeatureExplanation
        icon={PermissionIcons.transfer}
        text="Transfer tokens from your wallet"
      />

      <FeatureExplanation
        icon={PermissionIcons.wallet}
        text="Access your wallet address and balance"
      />
    </div>

    {rememberCheckbox}
  </div>
);

/**
 * Default permission content
 */
export const DefaultPermissionContent: React.FC<DefaultPermissionContentProps> = ({ origin, type, rememberCheckbox }) => (
  <div style={commonStyles.contentContainer}>
    <PermissionLevelIndicator level={PermissionLevel.CRITICAL} />

    <OriginBanner
      origin={origin}
      type={BannerType.CRITICAL}
      message="is requesting access to Signet"
    />

    <div style={{ margin: '10px 0', color: '#8C9CA8', fontSize: '11px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={commonStyles.iconContainer}>
          {PermissionIcons.warning}
        </div>
        <span>This website is requesting permission for an operation of type:</span>
      </div>
      <OperationTypeDisplay type={type} />
    </div>

    {rememberCheckbox}
  </div>
);