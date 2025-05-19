export type Trigger = {
			type?: 'standard' | 'custom'
			standardEvent?: 'onClick' | 'onScrollDown' | 'onScrollUp' | 'onTimeout'
			customEvent?: string
			_key: string
			goTo?: {
				_id: string
				title: string
			}
		}
