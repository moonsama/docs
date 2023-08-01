import React, { useCallback, useEffect, useState } from 'react'
import BrowserOnly from '@docusaurus/BrowserOnly'

const supportedNetworks = {
  moonsama: {
    chainId: '0x897',
    chainName: 'Moonsama Network',
    rpcUrls: ['https://rpc.moonsama.com'],
    blockExplorerUrls: ['https://explorer.moonsama.com/'],
    nativeCurrency: {
      name: 'Sama Token',
      symbol: 'SAMA',
      decimals: 18,
    },
  },
  exosama: {
    chainId: '0x83d',
    chainName: 'Exosama Network',
    rpcUrls: ['https://rpc.exosama.com'],
    blockExplorerUrls: ['https://explorer.exosama.com/'],
    nativeCurrency: {
      name: 'SAMA Token',
      symbol: 'SAMA',
      decimals: 18,
    },
  },
};

export default function ConnectToMetamask({ chain }) {
  const [network] = useState(supportedNetworks[chain])
  const [isConnected, setIsConnected] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  
  useEffect(async () => {
    const provider = window.ethereum
    if (provider) {
      const chainId = await provider.request({ method: 'eth_chainId' })
      setIsConnected(chainId === network.chainId)
    } else {
      setErrorMsg('Metamask not found. Please install the extension first.')
    }
  }, [network])

  useEffect(() => {
  const provider = window.ethereum
    if (provider) {
      provider.on('chainChanged', () => {
        window.location.reload()
      })
    }
  }, [])

  const connect = useCallback(async () => {
    const provider = window.ethereum
    if (provider) {
      try {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [network],
        });
      } catch (e) {
        console.log(e)
        if (e.code === -32002) {
          setErrorMsg('Request already in progress. Please confirm in your Metamask extension.')
        } 
        else if (e.code !== 4001) {
          setErrorMsg(e.message)
        }
      }
    }    
  }, [network])

  if (!network) {
    return <span />
  } else {
    return (
      <div style={{ margin: "10px 0" }}>
        {errorMsg && <p className="error-msg" style={{ outline: true }}>Error! {errorMsg}</p>}
        <button className="button" onClick={connect} disabled={isConnected}>
          Connect to {network.chainName}
        </button>
      </div>
    )
  }
}
